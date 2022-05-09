import axios from "axios";
import {Formik, ErrorMessage} from "formik";
import * as yup from "yup";
import Input from "../elements/Input";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.initialValues = {
            user: "",
            password: ""
        };
        this.validationSchema = yup.object().shape({
            user: yup.string().required("Field is required"),
            password: yup.string()
                .matches(/^(?=.*[a-z])/, "Field must contain at least 1 lower case letter")
                .matches(/^(?=.*[A-Z])/, "Field must contain at least 1 upper case letter")
                .matches(/^(?=.*[0-9])/, "Field must contain at least 1 number")
                .matches(/^(?=.*{8,})/, "Field must contain at least 8 characters")
                .matches(/^(?=.*[!@#$%^&*\(\)\-\_\=\+\[\]\{\}\;\'\:\"\|\,\.\/\<\>\?])/, "Field must contain at least 1 special character")
                .required("Field is required")
        });
        this.handleSubmit = (values, actions) => {
            axios.post("/api/login", values, {withCredentials: true})
                .then(({data}) => {
                    window.location = this.props.history.push(data.location);
                })
        }
    }
    render() {
        return (
            <main className="app__main">
                <Formik
                    validateOnChange={true}
                    validationSchema={this.validationSchema}
                    initialValues={this.initialValues}
                    handleSubmit={this.handleSubmit}
                >
                    {
                        props => {
                            <form className="app__form" onSubmit={props.handleSubmit}>
                                <Input label="Usename" type="text" name="user" formikProps={props} ErrorMessage={ErrorMessage}/>
                                <Input label="Password" type="password" name="user" formikProps={props} ErrorMessage={ErrorMessage}/>
                                <button type="submit" className="app__button--submit">Submit</button>
                            </form>
                        }
                    }
                </Formik>
            </main>
        );
    }
}

export default Login;