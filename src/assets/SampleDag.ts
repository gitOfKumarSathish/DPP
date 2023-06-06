export const Dagger = {
    "name": "dag",
    "func_nodes": [
        {
            "name": "function_0",
            "func_label": "times",
            "bind": {
                "fpr": "fpr",
                "n": "n"
            },
            "out": "fp_cost_p_unit"
        },
        {
            "name": "function_1",
            "func_label": "times",
            "bind": {
                "n": "n",
                "fnr": "fnr"
            },
            "out": "fn_cost_p_unit"
        },
        {
            "name": "function_2",
            "func_label": "times",
            "bind": {
                "fp": "fp",
                "fp_cost_p_unit": "fp_cost_p_unit"
            },
            "out": "fp_cost"
        },
        {
            "name": "function_3",
            "func_label": "times",
            "bind": {
                "fn": "fn",
                "fn_cost_p_unit": "fn_cost_p_unit"
            },
            "out": "fn_cost"
        },
        {
            "name": "function_4",
            "func_label": "add",
            "bind": {
                "fp_cost": "fp_cost",
                "fn_cost": "fn_cost"
            },
            "out": "total_cost"
        }
    ]
};

export const changedDager = {
    "name": "dag",
    "func_nodes": [
        {
            "name": "function_89",
            "func_label": "times0",
            "bind": {
                "fpr": "fpr",
                "n": "n"
            },
            "out": "fp_cost_p_unit"
        },
        {
            "name": "function_635",
            "func_label": "times1",
            "bind": {
                "fnr": "fnr",
                "n": "n"
            },
            "out": "fn"
        },
        {
            "name": "function_494",
            "func_label": "times2",
            "bind": {
                "fp": "fp",
                "fp_cost_p_unit": "fp_cost_p_unit"
            },
            "out": "fpcost"
        },
        {
            "name": "function_634",
            "func_label": "times3",
            "bind": {
                "fn": "fn",
                "fn_cost_p_unit": "fn_cost_p_unit"
            },
            "out": "fncost"
        },
        {
            "name": "function_429",
            "func_label": "add",
            "bind": {
                "fpcost": "fpcost",
                "fncost": "fncost"
            },
            "out": "total_cost"
        }
    ]
};

export const dd_dager = {
    "name": "dag",
    "func_nodes": [
        {
            "name": "function_873",
            "func_label": "Multiple",
            "bind": {
                "fpr": "fpr",
                "n": "n"
            },
            "out": "fp_cost_p_unit"
        },
        {
            "name": "function_235",
            "func_label": "Multiple",
            "bind": {
                "n": "n",
                "fnr": "fnr"
            },
            "out": "fn_cost_p_unit"
        },
        {
            "name": "function_33",
            "func_label": "Subtract",
            "bind": {
                "fp_cost_p_unit": "fp_cost_p_unit",
                "fp": "fp"
            },
            "out": "fpcost"
        },
        {
            "name": "function_148",
            "func_label": "Subtract",
            "bind": {
                "fn_cost_p_unit": "fn_cost_p_unit"
            },
            "out": "fncost"
        },
        {
            "name": "function_434",
            "func_label": "Add",
            "bind": {
                "fpcost": "fpcost",
                "fncost": "fncost"
            },
            "out": "total_cost"
        }
    ]
};