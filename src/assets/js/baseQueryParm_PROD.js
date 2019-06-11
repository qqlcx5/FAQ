const baseParm = {
    category: { //类别
        "cubeTableName": "faq_info_p_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 1,
        "rollUps": [{
            "checked": false,
            "cubeName": "className",
            "length": 200,
            "cubeTableName": "faq_info_p_cube",
            "dimName": "name",
            "show": true,
            "outputType": "string"
        }, {
            "checked": false,
            "cubeName": "insert_time_date",
            "length": 2,
            "cubeTableName": "faq_info_p_cube",
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
        "cubeTableName": "faq_info_p_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "cubeName": "insert_time_date",
            "length": 2,
            "order": 2,
            "cubeTableName": "faq_info_p_cube",
            "showFormat": "YM",
            "dateFilter": [],
            "dimName": "添加时间（年月)",
            "show": true,
            "outputType": "date"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_p_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m",
            "box": 0
        }]
    },
    noAnswer: { //待回答
        "cubeTableName": "faq_info_p_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "cubeName": "waitAnswer",
            "length": 10,
            "order": 4,
            "cubeTableName": "faq_info_p_cube",
            "dimName": "待添加",
            "show": true,
            "index": 0,
            "lstName": "dims",
            "exclude": "0",
            "outputType": "int"
        }, {
            "cubeName": "insert_time_date",
            "length": 2,
            "order": 2,
            "cubeTableName": "faq_info_p_cube",
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
            "cubeTableName": "faq_info_p_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m",
            "box": 0
        }]
    },
    closed: { //已关闭
        "cubeTableName": "faq_info_p_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "cubeName": "insert_time_date",
            "length": 2,
            "order": 2,
            "cubeTableName": "faq_info_p_cube",
            "showFormat": "HZ",
            "dateFilter": [],
            "dimName": "添加时间（汇总）",
            "show": false,
            "outputType": "date"
        }, {
            "cubeName": "visible",
            "length": 10,
            "order": 3,
            "cubeTableName": "faq_info_p_cube",
            "dimName": "状态",
            "show": true,
            "index": 1,
            "lstName": "dims",
            "exclude": "1",
            "outputType": "int"
        }],
        "measures": [{
            "cubeFieldName": "idcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_info_p_cube",
            "fieldName": "数量",
            "mtype": "sum",
            "cycType": "by_m",
            "box": 0
        }]
    },
    satisfaction: { //满意数
        "cubeTableName": "faq_acception_log_p_cube",
        "hasPrivot": true,
        "hasTranspose": false,
        "outputFormat": 2,
        "rollUps": [{
            "cubeName": "hitime_date",
            "length": 2,
            "order": 1,
            "cubeTableName": "faq_acception_log_p_cube",
            "showFormat": "YMD",
            "dateFilter": [],
            "dimName": "点击时间（年月日)",
            "show": false,
            "outputType": "date"
        }, {
            "cubeName": "satisfied",
            "length": 10,
            "order": 3,
            "cubeTableName": "faq_acception_log_p_cube",
            "dimName": "接受答案",
            "show": true,
            "index": 1,
            "lstName": "dims",
            "exclude": "0",
            "outputType": "int"
        }],
        "measures": [{
            "cubeFieldName": "questionIdcount",
            "length": 64,
            "outputType": "int",
            "cubeTableName": "faq_acception_log_p_cube",
            "fieldName": "意见合计",
            "mtype": "sum",
            "cycType": "by_m",
            "box": 0
        }]
    },
    faq: {
        outputFormat: 1,
        mergeDims: [{
                cubeTableFieldNames: [
                    "faq_acception_log_p_cube.点击时间（年月日)",
                    "faq_info_p_cube.添加时间（年月日)"
                ],
                dimName: "dims",
                cubeName: "",
                outputType: "",
                show: true,
                mergeOrder: "asc"
            },
            {
                cubeTableFieldNames: [
                    "faq_acception_log_p_cube.接受答案",
                    "faq_info_p_cube.待添加"
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
                cubeTableName: "faq_acception_log_p_cube",
                rollUps: [{
                    cubeName: "hitime_date",
                    length: 2,
                    cubeTableName: "faq_acception_log_p_cube",
                    showFormat: "YMD",
                    dateFilter: [],
                    dimName: "点击时间（年月日)",
                    show: true,
                    outputType: "date",
                }, {
                    cubeName: "satisfied",
                    length: 10,
                    cubeTableName: "faq_acception_log_p_cube",
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
                    cubeTableName: "faq_acception_log_p_cube",
                    fieldName: "满意数",
                    mtype: "sum",
                    cycType: "by_m"
                }]
            },
            {
                hasPrivot: false,
                hasTranspose: false,
                cubeTableName: "faq_info_p_cube",
                rollUps: [{
                    checked: false,
                    cubeName: "insert_time_date",
                    length: 2,
                    cubeTableName: "faq_info_p_cube",
                    showFormat: "YMD",
                    dateFilter: [],
                    dimName: "添加时间（年月日)",
                    show: true,
                    outputType: "date"
                }, {
                    checked: false,
                    cubeName: "waitAnswer",
                    length: 10,
                    cubeTableName: "faq_info_p_cube",
                    dimName: "待添加",
                    exclude: "0",
                    show: true,
                    outputType: "int"
                }],
                measures: [{
                    cubeFieldName: "idcount",
                    length: 64,
                    outputType: "int",
                    cubeTableName: "faq_info_p_cube",
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