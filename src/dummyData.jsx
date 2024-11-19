export const dummySurvey = {
    steps: [
        {
            label: "Ennen tapahtumaa",
            questions: [
                {
                    type: 'smiley',
                },
                {
                    type: 'bodypart'
                },
                {
                    title: 'Mitä tunnetta nämä värit kuvastavat kehossasi?',
                    type: 'freeform'
                }
            ]
        },
        {
            label: "Tapahtuman jälkeen",
            questions: [
                {
                    type: 'info',
                    heading: 'Pyydämme sinua kokemaan tapahtuman ennen tähän vaiheeseen vastaamista.',
                    title: 'Tässä vaiheessa kysytään kokemuksen jälkeisistä tuntemuksista.'
                },
                {
                    type: 'bodypart'
                },
                {
                    title: 'Mitä tunnetta nämä värit kuvastavat kehossasi?',
                    type: 'freeform'
                },
                {
                    title: 'Kuinka helppoa oli kuvailla tunteitasi väreillä?',
                    type: 'rating'
                }
            ]
        },
        {
            label: "Palautteen antaminen",
            questions: [
                {
                    title: 'Miten apin käyttö sujui? Mitä olisimme voineet tehdä paremmin?',
                    type: 'freeform'
                },
                {
                    title: 'Koetko, että värit voivat auttaa tunteiden ilmaisussa?',
                    type: 'rating'
                }
            ]
        }
    ]
}

export const dummySteps = [
    {
      label: 'Ennen kokemusta',
      description: '',
    },
    {
      label: 'Kokemuksen jälkeen',
      description: '',
    },
    {
      label: 'Palautteen antaminen',
      description: '',
    },
  ];