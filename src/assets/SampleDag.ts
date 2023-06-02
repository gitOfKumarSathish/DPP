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