export const versions = [
    {
        "version": "1.0.0",
        "files": ["covid19-001.zip", "covid19-002.zip"],
        "changes": '["Initial version"]',
        "date": "2020-01-28"
    },
    {
        "version": "1.1.0",
        "files": ["covid19-001.zip", "covid19-002covid19-002covid19-002covid19-002.zip", "covid19-003.zip"],
        "changes": '["Added data for Oct-2020"]',
        "date": "2020-11-28"
    },
    {
        "version": "2.0.1",
        "files": ["covid19-Jan.zip", 'covid19-002covid19-002covid19-002covid19-002.zip', "covid19-Feb.zip", "covid19-Mar.zip", "covid19-Oct.zip", "covid19-Nov.zip"],
        "changes": '["Restructured the dataset. New structure can be found in the readme.", "Added data for Jan-2020", "Added data for Feb-2020", "Added data for Nov-2020"]',
        "date": "2021-01-15"
    }
]

export const datasets = [
    {
        "id": "DTS-12345",
        "name": "Covid-19 Health Dataset",
        "description": `Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
        qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
        pariatur mollit ad adipisicing reprehenderit deserunt qui eu.`,
        "authorID": 342,
        "public": true,
        "source": "www.examplesource.com/covid-19-dts",
        "tnc": `Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
        qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
        pariatur mollit ad adipisicing reprehenderit deserunt qui eu.`
    },
]

export const comments = [
    {
        'id': '01',
        'text': 'This is comment 1',
        'author': 'User#1732',
        'replied': false
    },
    {
        'id': '02',
        'text': 'This is comment 2',
        'author': 'User#1735',
        'replied': true,
        'reply': {
            'id': '03',
            'text': 'This is comment 1',
            'author': 'User#1732',
            'replied': false
        },
    },
    {
        'id': '04',
        'text': 'This is comment 2',
        'author': 'User#1735',
        'replied': true,
        'reply': {
            'id': '05',
            'text': 'This is comment 1',
            'author': 'User#1732',
            'replied': true,
            'reply': {
                'id': '06',
                'text': 'This is comment 2',
                'author': 'User#1735',
                'replied': true,
                'reply': {
                    'id': '07',
                    'text': 'This is comment 1',
                    'author': 'User#1732',
                    'replied': false
                },
            },
        },
    },
    {
        'id': '08',
        'text': 'This is comment 1',
        'author': 'User#1732',
        'replied': false
    },
    {
        'id': '09',
        'text': 'This is comment 2',
        'author': 'User#1735',
        'replied': true,
        'reply': {
            'id': '10',
            'text': 'This is comment 1',
            'author': 'User#1732',
            'replied': true,
            'reply': {
                'id': '11',
                'text': 'This is comment 2',
                'author': 'User#1735',
                'replied': true,
                'reply': {
                    'id': '12',
                    'text': 'This is comment 1',
                    'author': 'User#1732',
                    'replied': true,
                    'reply': {
                        'id': '13',
                        'text': 'This is comment 2',
                        'author': 'User#1735',
                        'replied': false
                    }
                },
            },
        },
    },

]