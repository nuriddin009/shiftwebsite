import FormInputControl from './FormInputControl';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import SelectAddModal from './SelectModal';


const filter = createFilterOptions();

const FormAsyncSelectInput = (props) => {
    const [value, setValue] = React.useState({});
    const [open, toggleOpen] = React.useState(false);


    React.useEffect(() => {
        const initValue = props.options.find(option => option.value === props.reducer?.[props.nameInReducer])
        setValue(initValue ?? {})
    }, [props.options, [props.reducer]?.[props.nameInReducer]])

    const handleClose = () => {
        setDialogValue({
            label: '',
            value: '',
        });
        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        code: '',
        value: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.designationId) {
            props.submitModal?.({
                code: dialogValue.code,
                description: dialogValue.value,
                designationId: props.designationId
            })
        } else {
            props.submitModal?.({
                code: dialogValue.code,
                description: dialogValue.value
            })
        }
        handleClose();
    };

    function handleChange(event, newValue) {
        if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
                toggleOpen(true);
                setDialogValue({
                    value: newValue,
                    code: '',
                });
            });
        } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
                value: newValue.inputValue,
                code: '',
            });
        } else {
            setValue(newValue ?? {});
            props.addToReducer({[props.nameInReducer]: newValue?.value})
        }
    }

    return (
        <FormInputControl label={props.label} labelSize={props.labelSize}>
            <React.Fragment>
                <Autocomplete
                    value={value}
                    onChange={handleChange}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                label: `Add "${params.inputValue}"`,
                            });
                        }

                        return filtered;
                    }}
                    options={props?.options}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.title;
                    }}
                    renderOption={(props, option) => {
                        return <li {...props} value={option.value}>{option.label}</li>
                    }}
                    handleHomeEndKeys
                    selectOnFocus
                    clearOnBlur
                    fullWidth
                    freeSolo
                    renderOption={(props, option) => <li {...props}>{option.title}</li>}
                    size='small'
                />
                <SelectAddModal
                    open={open}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    title={`Add ${props.label.toLowerCase()}`}
                    // contentText={`Did you miss any ${props.label.toLowerCase()} in our list? Please, add it!`}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        value={dialogValue.value ?? ''}
                        onChange={(event) =>
                            setDialogValue({
                                ...dialogValue,
                                value: event.target.value,
                            })
                        }
                        label="name"
                        type="text"
                        variant="outlined"
                        error={dialogValue.value === ''}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        value={dialogValue.code ?? ''}
                        onChange={(event) =>
                            setDialogValue({
                                ...dialogValue,
                                code: event.target.value,
                            })
                        }
                        label="code"
                        type="text"
                        variant="outlined"
                        error={dialogValue.code === ''}
                    />
                </SelectAddModal>
            </React.Fragment>
        </FormInputControl>
    );
};

export default FormAsyncSelectInput;
