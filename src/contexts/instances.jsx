import { createContext, useContext, useState } from "react";
import UserContext from "./user";
import axios from "axios";
import { dummySurvey } from "../dummyData";
import VarcharGenerator from "../components/VarcharGenerator";

const InstanceContext = createContext();

function InstanceProvider({ children }) {

    // Setup axios base URL
    axios.defaults.baseURL = import.meta.env.VITE_API_URL
    axios.defaults.withCredentials = true

    const { user } = useContext(UserContext);

    const storedInstances = JSON.parse(localStorage.getItem("instances"));
    const storedProgresses = JSON.parse(localStorage.getItem("progresses"));
    const storedAnswers = JSON.parse(localStorage.getItem("answers"));

    const [instances, setInstances] = useState(storedInstances || []);
    const [progresses, setProgresses] = useState(storedProgresses || []);
    const [answers, setAnswers] = useState(storedAnswers || []);

        const increaseProgress = (id) => {
            const updatedProgress = progresses.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        progress: item.progress + 1
                    }
                }
                return item
            })
            setProgresses(updatedProgress)
            localStorage.setItem("progresses", JSON.stringify(updatedProgress))
        }
        
        const getProgressById = (id) => {
            // If progress for current instance doesn't exist, create it on the fly
            if (!progresses.map(item => item.id).includes(id)) {
                const newProgresses = [...progresses, {id: id, progress: 0}]
                setProgresses(newProgresses)
                localStorage.setItem("progresses", JSON.stringify(newProgresses))
            }
            for (const item of progresses) {
                if (item.id === (id)) {
                    return item.progress
                }
            }
            return 0
        }

        const addInstances = (instanceArray) => {

            const instanceMap = new Map()
            const combinedInstances = [...instances, ...instanceArray]
            combinedInstances.forEach((object) => {
                instanceMap.set(object.id, object)
            })

            // Set the state to the edited ones with the progress added
            setInstances(Array.from(instanceMap.values()))
            localStorage.setItem("instances", JSON.stringify(Array.from(instanceMap.values())))
        }

        const saveSurveyAnswers = (id, answerData = {}) => {

            console.log("Save survey answers: ", id, answerData)

            // Update the progress state
            getProgressById(id)
            increaseProgress(id)

            if (answers.map(item => item.id).includes(id)) {

                // Edit an existing item

                let returnData
                const newAnswers = answers.map((item) => {
                
                    if (item.id === id) {
    
                        // Add an answers key if there is none to avoid a missing reference
                        if (!item.answers) {
                            item.answers = {}
                        }
    
                        // Merge the answers from the new data and the existing data
                        let answerObject = {};
                        for (const key of [...new Set (Object.keys(answerData).concat(Object.keys(item.answers)))]) {
    
                            // Add missing keys
                            if (!item.answers[key]) {
                                item.answers[key] = []
                            }
    
                            // Concatenate to existing keys and don't add null values
                            answerObject[key] = item.answers[key].concat(answerData[key]? answerData[key] : [])
                        }
    
                        returnData = {
                            ...item, 
                            answers: answerObject
                        }

                        return returnData;
                }
                return item;
                });

                setAnswers(newAnswers)
                localStorage.setItem("answers", JSON.stringify(newAnswers))
                return returnData

            } else {
                
                // Add a new item

                const newItem = {id: id, answers: answerData}
                const newAnswers = [...answers, newItem]

                setAnswers(newAnswers)
                localStorage.setItem("answers", JSON.stringify(newAnswers))
                return newItem
            }
            
        };

        const getAnswersById = (id) => {
            for (const item of answers) {
                if (item.id === id) {
                    return item.answers
                }
            }
        }

        const modifySurvey = async (id, value) => {
            try {
                await axios.post(`/instances/saveSurvey`, {instance_id: id, ...value})
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        };

        const createInstance = async (name) => {

            const randomId = VarcharGenerator()
    
            let newInstance = {
                name: name,
                random_id: randomId
            }
    
            if (user) {
                newInstance = {
                    ...newInstance,
                    owner_id: user.id
                }
            }
    
            await axios.post('/instances/create', newInstance)
            await getInstancesByUser()
            
            return randomId
        }

        const joinInstance = async (joinCode) => {

            try {
                const join = await axios.post('/instances/join', { random_id: joinCode })
                let instance = join.data.instance

                const {data} = await axios.get('/instances/getSurvey', { params: {instance_id: join.data.instance.id} })
                instance.questions = data

                // All checks pass, join instance
                addInstances([instance])
            } catch (error) {
                throw new Error(error.response.data.message)
            }
        }

        const getInstancesByUser = async () => {
            let userInstances = [];
            if (user) {
                const {data} = await axios.get('/instances/myprofile')
                userInstances = data
            } else {
                userInstances = instances
            }

            setInstances(userInstances)
            localStorage.setItem("instances", JSON.stringify(userInstances))
            return userInstances
        }

        const getInstanceById = async (id) => {
            try {
                // Get the instance data
                const instance = await axios.get('/instances/singleInstance', { params: {instance_id: id} })
                let data = instance.data

                // Get the questionnaire for the instance
                const questions = await axios.get('/instances/getSurvey', { params: {instance_id: id} })
                data.questions = questions.data

                console.log("Get instance from backend: ", data)
                return data;
            } catch (error) {
                throw new Error(error)
            }
        }

        const getOwnedInstances = async () => {
            const { data } = await axios.get('/instances/myOwnInstances')
            return data
        }

        const leaveAllInstances = async () => {
            await axios.post('/instances/leaveAll', { profile_id: user.id })
            // Empty the state so we don't see any instances that we aren't in
            setInstances([])
            localStorage.setItem("instances", JSON.stringify([]))

        }

        const sendAnswers = async (instanceId, answers) => {

            // declare the id that will be used to link the answers to response event
            let responseId;
    
            // Construct the data to be inserted
            let insertData = {
                instance_id: instanceId
            }
            if (user) {
                insertData.profile_id = user.id
            }
    
            try {
                // Insert the response
                const response = await axios.post('/instances/response', insertData);
                responseId = response.data.response.id;

            } catch (error) {
                console.error(error)
                return
            }


            // Upload answers
            let uploadData = {}
    
            // No need for snake case
            /*for (const key of Object.keys(answerData)) {
                const keyToSnake = console.log(key.replace(/[A-Z]/g, match => "_" + match.toLowerCase()))
            }*/

            // This doesn't work, all the keys are needed by the backend but not all may be present
            /*for (const key of Object.keys(answers)) {
                uploadData[key] = answers[key].map(item => ({ ...item, response_id: responseId }))
            }*/

            // Botched solution
            uploadData.bodyData = answers.circleData? answers.circleData.map(item => ({ ...item, response_id: responseId, instance_id: instanceId })) : []
            uploadData.emojiData = answers.emojiData? answers.emojiData.map(item => ({ ...item, response_id: responseId, instance_id: instanceId })) : []
            uploadData.freeformData = answers.freeformData? answers.freeformData.map(item => ({ ...item, response_id: responseId, instance_id: instanceId })) : []
            uploadData.ratingData = answers.ratingData? answers.ratingData.map(item => ({ ...item, response_id: responseId, instance_id: instanceId })) : []
            uploadData.ageData = answers.radioData? answers.radioData.map(item => ({ ...item, response_id: responseId, instance_id: instanceId })) : []

            console.log("Upload data: ", uploadData)

            // Upload answers
            axios.post('/instances/answer', uploadData)
        }

        const getParticipants = async (id) => {

            const { data } = await axios.get("/instances/participantCount", { params: {instance_id: id}})
            console.log("Participants: ", data)

            // Get participant IDs for instance
            const uniqueParticipants = data.map(item => (item.profile_id))
            return uniqueParticipants;
        }

        const getRespondants = async (id) => {
            const { data } = await axios.get("/instances/respondants", { params: {instance_id: id}})
            console.log("Respondants: ", data)

            // Get respondant IDs for instance
            const uniqueRespondants = data.map(item => (item.profile_id))
            return uniqueRespondants
        }

        const getResponsesByInstanceId = async (id) => {
            const { data } = await axios.get("/instances/responseIds", { params: {instance_id: id}})
            return data
        }

        const getAnswersByResponseId = async (id) => {
            console.log("Get answers by response ID: ", id)
            const { data } = await axios.get("/instances/OneUserAnswer", { params: {response_id: id}})
            return data
        }

        const getOverviewByInstanceId = async (id) => {
            let combinedData =  {}

            // Get circle data and emoji data for the instance
            const circleData = await axios.get("/instances/bodyDataInstance", { params: {instance_id: id}})
            combinedData.circleData = circleData.data

            const emojiData = await axios.get("/instances/emojiDataInstance", { params: {instance_id: id}})
            combinedData.emojiData = emojiData.data

            try {
                const averageAge = await axios.get("/instances/averageAge", { params: {instance_id: id}})
                combinedData.averageAge = averageAge.data.averageAge
            } catch (error) {
            }
            
            return combinedData
        }

        const getRoleByInstanceId = async (id) => {
            try {
                const { data } = await axios.get("/instances/getRole", { params: {profile_id: user.id, instance_id: id}})
                return data    
            } catch (error) {
                return null
            }
            
        }

        const promoteToOwner = async (instanceId, email) => {
            try {
                await axios.post('/instances/promote', {instance_id: instanceId, email: email})   
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }

        const getRandomBodyDataByInstanceId = async (id) => {
            const response = await axios.get('/instances/randomBodyData', {
                params: {
                    instance_id: id 
                }
                });
                return response.data
        }

    const providedValues = {
            instances,
            progresses,
            createInstance,
            joinInstance,
            addInstances,
            getInstancesByUser,
            getInstanceById,
            getProgressById,
            getRoleByInstanceId,
            getOwnedInstances,
            leaveAllInstances,
            saveSurveyAnswers,
            getAnswersById,
            modifySurvey,
            sendAnswers,
            getParticipants,
            getRespondants,
            getResponsesByInstanceId,
            getAnswersByResponseId,
            getOverviewByInstanceId,
            getRandomBodyDataByInstanceId,
            promoteToOwner
    };
    

    return (
        <InstanceContext.Provider value={providedValues}>
            {children}
        </InstanceContext.Provider>
    );
}

export { InstanceProvider };
export default InstanceContext;
