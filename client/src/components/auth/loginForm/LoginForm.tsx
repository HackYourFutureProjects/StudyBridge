import type {loginData} from "../../../pages/loginPage/LoginPage.tsx";
import {useForm} from "react-hook-form";
import type {FormValues} from "./loginFormTypes.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "./loginForm.validation.ts";
import {ControlledTextField} from "../../ui/controlled/controlledTextField/ControlledTextField.tsx";
import {Button} from "../../ui/button/Button.tsx";
import Google from "../../icons/Google.tsx";
import type {Role} from "../types.ts";


type LoginFormTypes = {
    loading: boolean;
    title: string;
    role: Role;
    onSubmit: (data: loginData & {role: Role}) => void;
}

export const LoginForm = ({loading, onSubmit, title, role}: LoginFormTypes) => {
    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });


    const onSubmitForm = (data: loginData) => {
        onSubmit({...data, role});
        reset();
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            <h1 className="auth-title">{title}</h1>
            <h3 className="auth-subtitle">
                Welcome back! Please log in to access your account.
            </h3>

            <div className="auth-content">
                <div className="auth-fields">
                    <ControlledTextField placeholder="Enter your Email" control={control} name="email" />
                    <ControlledTextField placeholder="Enter your password" control={control} name="password" type="password" />
                </div>


                <div className="auth-actions">
                    <div className="auth-actions-inner">
                        <Button variant="link" className="auth-link-underline" type="button">
                            Forgot Password?
                        </Button>
                        <Button variant="secondary" size="auth" type="submit">Sign In</Button>
                        <Button variant="tertiary" size="auth" type="button">Sign Up</Button>
                    </div>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">Or Continue with</span>
                        <div className="auth-divider-line" />
                    </div>

                    <Button variant="link" type="button"><Google /></Button>
                </div>
            </div>

            {loading && <div>Loading...</div>}
        </form>
    );
};

