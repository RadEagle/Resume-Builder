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
            <div className="flex flex-row justify-between gap-5">
                {   
                    props.label ?
                    <label htmlFor="abstract-input">
                        {props.label}
                    </label> : null
                }
                <input 
                    id="abstract-input"
                    type={props.type}
                    required={props.required}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    className="dark:bg-gray-50 rounded-md px-4 py-1"
                />
            </div>
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