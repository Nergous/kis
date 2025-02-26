import React from "react";
import styled from "styled-components";
import { Form, Input } from "antd";

const StyledInput = styled(Input)`
    ::-webkit-input-placeholder {
        color: black !important;
        opacity: 1 !important;
    }
`;

const StyledInputPassword = styled(Input.Password)`
    ::-webkit-input-placeholder {
        color: black !important;
        opacity: 1 !important;
    }
`;

const FormInput = ({ name, rules, type, prefix, placeholder }) => {
    const style = {
        transition: "all 0.3s",
        height: 40,
        fontSize: 16,
    };

    const InputComponent =
        type === "password" ? StyledInputPassword : StyledInput;

    return (
        <Form.Item name={name} rules={rules}>
            <InputComponent
                prefix={prefix}
                placeholder={placeholder}
                style={style}
            />
        </Form.Item>
    );
};

export default FormInput;
