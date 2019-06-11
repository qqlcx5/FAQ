const baseParm = {
    category: { //类别
        "cubeTableName": "faq_info_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 1,
        "rollUps": [{
            "checked": false,
            "cubeName": "className",
            "length": 200,
            "cubeTableName": "faq_info_cube",
            "dimName": "name",
            "show": true,
            "outputType": "string"
        }, {
            "checked": false,
            "cubeName": "insert_time_date",
            "length": 2,
            "cubeTableName": "faq_info_cube",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "添加时间（年月日)",
            "show": false,
            "outputType": "date"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_cube",
            "fieldName": "value",
            "mtype": "sum",
            "cycType": "by_m"
        }]
    },
    questionTotal: { //问答总数
        "cubeTableName": "faq_info_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "checked": false,
            "cubeName": "insert_time_date",
            "length": 2,
            "cubeTableName": "faq_info_cube",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "添加时间（年月日)",
            "show": true,
            "outputType": "date"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m"
        }]
    },
    noAnswer: { //待回答
        "cubeTableName": "faq_info_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "checked": false,
            "cubeName": "waitAnswer",
            "length": 10,
            "cubeTableName": "faq_info_cube",
            "dimName": "待添加",
            "show": true,
            "index": 0,
            "lst": "dims",
            "exclude": "0",
            "outputType": "int"
        }, {
            "checked": false,
            "cubeName": "insert_time_date",
            "length": 2,
            "cubeTableName": "faq_info_cube",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "添加时间（年月日)",
            "show": true,
            "outputType": "date"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m"
        }]
    },
    closed: { //已关闭
        "cubeTableName": "faq_info_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "checked": false,
            "cubeName": "visible",
            "length": 10,
            "cubeTableName": "faq_info_cube",
            "dimName": "状态",
            "show": true,
            "index": 0,
            "lst": "dims",
            "exclude": "1",
            "outputType": "int"
        }, {
            "checked": false,
            "cubeName": "insert_time_date",
            "length": 2,
            "cubeTableName": "faq_info_cube",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "添加时间（年月日)",
            "show": true,
            "outputType": "date"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m"
        }]
    },
    satisfaction: { //满意度
        "cubeTableName": "faq_acception_log_cube2",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "checked": false,
            "cubeName": "hitime_date",
            "length": 2,
            "cubeTableName": "faq_acception_log_cube2",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "点击时间（年月日)",
            "show": false,
            "index": 0,
            "lst": "dims",
            "outputType": "date"
        }, {
            "checked": false,
            "cubeName": "satisfied",
            "length": 10,
            "cubeTableName": "faq_acception_log_cube2",
            "dimName": "接受答案",
            "show": true,
            "index": 1,
            "lst": "dims",
            "exclude": "0",
            "outputType": "int"
        }],
        "measures": [{
            "cubeFieldName": "questionIdcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_acception_log_cube2",
            "fieldName": "意见合计",
            "mtype": "sum",
            "cycType": "by_m"
        }]
    },
    faq: {
        outputFormat: 1,
        mergeDims: [{
                cubeTableFieldNames: [
                    "faq_acception_log_cube2.点击时间（年月日)",
                    "faq_info_cube.添加时间（年月日)"
                ],
                dimName: "dims",
                cubeName: "",
                outputType: "",
                show: true,
                mergeOrder: "asc"
            },
            {
                cubeTableFieldNames: [
                    "faq_acception_log_cube2.接受答案",
                    "faq_info_cube.待添加"
                ],
                dimName: "维度集合2",
                cubeName: "",
                outputType: "",
                show: false
            }
        ],
        criteriaCubes: [{
                hasPrivot: false,
                hasTranspose: false,
                cubeTableName: "faq_acception_log_cube2",
                rollUps: [{
                    cubeName: "hitime_date",
                    length: 2,
                    cubeTableName: "faq_acception_log_cube2",
                    showFormat: "YMD",
                    dateFilter: [],
                    dimName: "点击时间（年月日)",
                    show: true,
                    outputType: "date",
                }, {
                    cubeName: "satisfied",
                    length: 10,
                    cubeTableName: "faq_acception_log_cube2",
                    dimName: "接受答案",
                    show: true,
                    lst: "dims",
                    exclude: "0",
                    outputType: "int"
                }],
                measures: [{
                    cubeFieldName: "questionIdcount",
                    length: 64,
                    outputType: "int",
                    cubeTableName: "faq_acception_log_cube2",
                    fieldName: "满意数",
                    mtype: "sum",
                    cycType: "by_m"
                }]
            },
            {
                hasPrivot: false,
                hasTranspose: false,
                cubeTableName: "faq_info_cube",
                rollUps: [{
                    checked: false,
                    cubeName: "insert_time_date",
                    length: 2,
                    cubeTableName: "faq_info_cube",
                    showFormat: "YMD",
                    dateFilter: [],
                    dimName: "添加时间（年月日)",
                    show: true,
                    outputType: "date"
                }, {
                    checked: false,
                    cubeName: "waitAnswer",
                    length: 10,
                    cubeTableName: "faq_info_cube",
                    dimName: "待添加",
                    exclude: "0",
                    show: true,
                    outputType: "int"
                }],
                measures: [{
                    cubeFieldName: "idcount",
                    length: 64,
                    outputType: "int",
                    cubeTableName: "faq_info_cube",
                    fieldName: "待回答",
                    mtype: "sum",
                    cycType: "by_m"
                }]
            }
        ]
    }
}


export {
    baseParm
}