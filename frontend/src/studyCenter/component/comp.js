import {Component, Fragment} from "react";
import {TextField} from "@mui/material";
import PropTypes from "prop-types";

function NumberFormat(props) {
    return null;
}

NumberFormat.propTypes = {
    thousandSeparator: PropTypes.string,
    onValueChange: PropTypes.func,
    decimalSeparator: PropTypes.string,
    isNumericString: PropTypes.bool
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value
                    }
                });
            }}
            thousandSeparator={","}
            decimalSeparator={"."}
            isNumericString
            prefix={props.prefix} //"$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

class NumberTextField extends Component {
    state = {
        numberformat: this.props.value
    };

    handleChange = event => {
        const targetField = this.props.name;
        const targetValue = event.target.value;
        this.setState({
            ...this.state,
            numberformat: targetValue
        });
        this.props.updateCurrentUserFieldsOnChange(targetField, targetValue);
    };

    render() {
        const { fullWidth, label, name, readOnly, prefix } = this.props;
        return (
            <Fragment>
                <TextField
                    fullWidth={fullWidth ? fullWidth : true}
                    label={label ? label : "react-number-format"}
                    name={name}
                    value={this.state.numberformat}
                    onChange={this.handleChange}
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                        readOnly: Boolean(readOnly),
                        prefix: prefix
                    }}
                />
            </Fragment>
        );
    }
}