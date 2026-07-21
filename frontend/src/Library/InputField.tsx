interface CustomFieldProps {
    type: string
    label: string | null
    value: string
    placeholder: string
    onChange: (e: string) => void
}

interface InputFieldProps {
    label: string | null
    value: string
    placeholder: string
    onChange: (e: string) => void
}

interface PasswordFieldProps {
    label: string | null
    value: string
    placeholder: string
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
              label={props.label}
              placeholder={props.placeholder}
              value={props.value}
              onChange={props.onChange}
            />
        </>
    )
}

export { InputField, PasswordField }