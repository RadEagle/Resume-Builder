import { fieldControlClass } from "./fieldStyles"

interface CustomFieldProps {
    type: string
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

interface InputFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

interface PasswordFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

interface DateFieldProps {
    label: string | null
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: string) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const CustomField = (props: CustomFieldProps) => {
    return(
        <>
            {   
                props.label ?
                <label className="text-left">
                    {props.label}
                    {props.required ? <span className="text-red-500"> *</span> : null}
                </label> : null
            }
            <input 
                type={props.type}
                required={props.required}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                onKeyDown={props.onKeyDown}
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
              onKeyDown={props.onKeyDown}
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
              onKeyDown={props.onKeyDown}
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
              onKeyDown={props.onKeyDown}
            />
        </>
    )
}

export { InputField, PasswordField, DateField }