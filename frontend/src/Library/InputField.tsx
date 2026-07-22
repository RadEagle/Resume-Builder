import { fieldControlClass } from "./fieldStyles"

interface CustomFieldProps {
    type: string
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
}

interface InputFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
}

interface PasswordFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
}

interface DateFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
}

const CustomField = (props: CustomFieldProps) => {
    return(
        <>
            {   
                props.label ?
                <label className="text-left">
                    {props.label}
                </label> : null
            }
            <input 
                type={props.type}
                required={props.required}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                className={`${fieldControlClass}`}
            />
        </>
    )
}

const InputField = (props: InputFieldProps) => {
    return(
        <>
            <CustomField 
              type="text"
              required={props.required}
              label={props.label}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
        </>
    )
}

const PasswordField = (props: PasswordFieldProps) => {
    return(
        <>
            <CustomField 
              type="password"
              required={props.required}
              label={props.label}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
        </>
    )
}

const DateField = (props: DateFieldProps) => {
    return(
        <>
            <CustomField 
              type="date"
              required={props.required}
              label={props.label}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
        </>
    )
}

export { InputField, PasswordField, DateField }