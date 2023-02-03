import { default as React, Fragment, useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, CardText, CardTitle, Col, Container, Form, Row } from "reactstrap";
import SweetAlert from 'sweetalert2';



import { useHistory } from "react-router";
import Birthdate from '../components/forms/form-layout/form-wizard-1/birthdate';
import Emails from '../components/forms/form-layout/form-wizard-1/email';

import Registration from "../components/forms/form-layout/form-wizard-1/registration";
import GarageStep from "../components/garage_management/forms/GarageStep";
import ServiceStep from "../components/garage_management/forms/ServiceStep";
import UserStep from "../components/garage_management/forms/UserStep";
import MultiStepProgressBar from "../components/garage_management/utils/MultiStepProgressBar";
import { apiClient } from "../utils/apiClient";
import { BACKEND_API } from "../utils/backend";




export default function SignUp() {
    const history = useHistory()
    const [state, setState] = useState({
        currentStep: 1,
    })
    const [user, setUser] = useState({
        first_Name: '',
        last_Name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        image: '',
        address_line_1: '',
        address_line_2: '',
        country: '',
        city: '',
        postcode: '',
    })
    const [garage, setGarage] = useState({
        name: '',
        about: '',
        web_page: '',
        phone: '',
        email: '',
        additional_information: '',
        address_line_1: '',
        address_line_2: '',
        country: '',
        city: '',
        postcode: '',
        logo: '',
        is_mobile_garage: '1',
        wifi_available: '1',
        labour_rate: '',
        average_time_slot: '',
    })

    const [automobileCategories, setAutomobileCategories] = useState([]);

    const [service, setService] = useState([
        {
            automobile_category_id: "1",
            services: [

            ],
            automobile_makes: [

            ]
        }
    ])
    const loadAutomobileMakes = () => {
        apiClient().get(`${BACKEND_API}/v1.0/automobile-makes-all/${1}`)
            .then(response => {
                console.log("makes", response.data)
                let makes = response.data
                // setAutomobileCategories(categories)

                // let tempServices = JSON.parse(JSON.stringify(service))

                // tempServices[0] = {
                // ...tempServices[0],
                // services:[...tempServices[0].services],
                // automobile_makes:[...makes]
                // };

                // setService(tempServices)
                loadServices(makes)
            })
            .catch(error => {

                if (error.response?.status === 401) {
                    SweetAlert.fire({ title: error.response.data.message, text: "Hello!!! You do not have permission.", icon: "warning" });
                }
                else {
                    SweetAlert.fire({ title: "something went wrong!!", text: "Please Try Again", icon: "warning" });
                }
            })
    }
    useEffect(() => {
        loadAutomobileCategories()
        loadAutomobileMakes()
    }, [])

    const loadAutomobileCategories = () => {
        apiClient().get(`${BACKEND_API}/v1.0/automobile-categories/get/all`)
            .then(response => {
                console.log(response.data)
                let categories = response.data
                setAutomobileCategories(categories)

            })
            .catch(error => {
                if (error.response?.status == 401) {
                    SweetAlert.fire({ title: error.response.data.message, text: "Hello!!! You do not have permission.", icon: "warning" });
                }
                else {
                    SweetAlert.fire({ title: "something went wrong!!", text: "Please Try Again", icon: "warning" });
                }
            })
    }

    const loadServices = (makes) => {
        apiClient().get(`${BACKEND_API}/v1.0/services-all/${1}`)
            .then(response => {
                console.log("services", response.data)
                let services = response.data
                // setAutomobileCategories(categories)
                let tempServices = JSON.parse(JSON.stringify(service))

                console.log(tempServices)
                tempServices[0] = {
                    ...tempServices[0],
                    services: [...services],
                    automobile_makes: makes

                };

                setService(tempServices)
            })
            .catch(error => {
                if (error.response?.status == 401) {
                    SweetAlert.fire({ title: error.response.data.message, text: "Hello!!! You do not have permission.", icon: "warning" });
                }
                else {
                    SweetAlert.fire({ title: "something went wrong!!", text: "Please Try Again", icon: "warning" });
                }
            })
    }

    const [serverSideErrors, setServerSideErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    let permissions = JSON.parse(localStorage.getItem("permissions"));

    const addCategory = () => {
        let tempServices = JSON.parse(JSON.stringify(service))
        tempServices.push({
            automobile_category_id: "1",
            services: [
            ],
            automobile_makes: [
            ]
        });
        // console.log(service)
        // console.log(tempServices)
        setService(tempServices)
    }

    const steps = [
        { name: 'Step 1', component: <Registration /> },
        { name: 'Step 2', component: <Emails /> },
        { name: 'Step 3', component: <Birthdate /> },
    ]

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }
    const handleGarageChange = (e) => {
        const { name, value } = e.target;
        setGarage({ ...garage, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    };



    const _next = () => {
        let currentStep = state.currentStep;

        currentStep = currentStep >= 2 ? 3 : currentStep + 1;

        setState({
            ...state,
            currentStep: currentStep
        });




    }

    const _prev = () => {
        let currentStep = state.currentStep;
        // If the current step is 2 or 3, then subtract one on "previous" button click
        currentStep = currentStep <= 1 ? 1 : currentStep - 1;
        setState({
            ...state,
            currentStep: currentStep
        });
    }
    const previousButton = () => {
        let currentStep = state.currentStep;

        // If the current step is not 1, then render the "previous" button
        if (currentStep !== 1) {
            return (
                <Button color="secondary float-left" onClick={_prev}>
                    Previous
                </Button>
            );
        }

        // ...else return nothing
        return null;
    }

    const nextButton = () => {
        let currentStep = state.currentStep;
        // If the current step is not 3, then render the "next" button
        if (currentStep < 3) {
            return (
                <Button color="primary float-right" onClick={handleSubmitStep}>
                    Next
                </Button>
            );
        }
        // ...else render nothing
        return null;
    }
    const submitButton = () => {
        let currentStep = state.currentStep;

        // If the current step is the last step, then render the "submit" button
        if (currentStep > 2) {
            return <Button color="primary float-right" type='button' onClick={handleSubmitStep}>Submit</Button>;
        }
        // ...else render nothing
        return null;
    }

    const handleCategoryChange = (e) => {
        let index = e.target.name.split("-")[1];
        let name = e.target.name.split("-")[2];

        let tempServices = JSON.parse(JSON.stringify(service))
        console.log(tempServices, index, name)
        tempServices[index] = {
            ...tempServices[index],
            [name]: e.target.value
        };
        setService(tempServices)
    }

    const handleMakeChange = (e) => {
        const { name } = e.target
        let index = name.split("-")[1];
        let makeIndex = name.split("-")[3];

        let tempServices = JSON.parse(JSON.stringify(service))
        console.log(tempServices)





        tempServices[index].automobile_makes[makeIndex].checked = !tempServices[index].automobile_makes[makeIndex].checked;

        tempServices[index].automobile_makes[makeIndex].models.forEach(element => {
            element.checked = true;
            return element
        });


        setService(tempServices)
    }

    const handleModelChange = (e) => {
        const { name } = e.target
        let index = name.split("-")[1];
        let makeIndex = name.split("-")[3];
        let modelIndex = name.split("-")[5];

        let tempServices = JSON.parse(JSON.stringify(service))
        console.log(tempServices)

        tempServices[index].automobile_makes[makeIndex].models[modelIndex].checked = !tempServices[index].automobile_makes[makeIndex].models[modelIndex].checked;
        setService(tempServices)
    }

    const handleServiceChange = (e) => {
        const { name } = e.target
        let index = name.split("-")[1];
        let serviceIndex = name.split("-")[3];

        let tempServices = JSON.parse(JSON.stringify(service))
        console.log(tempServices)


        tempServices[index].services[serviceIndex].checked = !tempServices[index].services[serviceIndex].checked;
        tempServices[index].services[serviceIndex].sub_services.forEach(element => {
            element.checked = true;
            return element
        });
        setService(tempServices)
    }

    const handleSubServiceChange = (e) => {
        const { name } = e.target;
        let index = name.split("-")[1];
        let serviceIndex = name.split("-")[3];
        let subServiceIndex = name.split("-")[5];

        let tempServices = JSON.parse(JSON.stringify(service));
        console.log(subServiceIndex);
        console.log("test", tempServices[index].services[serviceIndex].sub_services[subServiceIndex]);
        tempServices[index].services[serviceIndex].sub_services[subServiceIndex].checked = !tempServices[index].services[serviceIndex].sub_services[subServiceIndex].checked;
        setService(tempServices)
    }



    // HANDLE FORM SUBMISSION 
    const handleSubmitStep = () => {
        let currentStep = state.currentStep;
        apiClient().post(`${BACKEND_API}/v1.0/auth/user-register-with-garage`, {
            user: user,
            garage: garage,
            service: currentStep === 3 ? service[0] : null
        }).then(res => {
            localStorage.setItem('token', res?.data?.user?.token);
            SweetAlert.fire({ title: "Success", text: "Garage Registered Successfully!", icon: "success" })
            .then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `${process.env.PUBLIC_URL}/login`;
                }
              });
            
        }).catch(error => {
            setLoading(false)
            if (error.response?.status === 422) {
                const { errors } = error.response.data
                setServerSideErrors(errors)
                if (
                    (currentStep >= 1)
                    &&
                    (
                        errors["user.first_Name"]
                        ||
                        errors["user.last_Name"]
                        ||
                        errors["user.email"]
                        ||
                        errors["user.password"]
                        ||
                        errors["user.phone"]
                        ||
                        errors["user.image"]
                        ||
                        errors["user.address_line_1"]
                        ||
                        errors["user.address_line_2"]
                        ||
                        errors["user.country"]
                        ||
                        errors["user.city"]
                        ||
                        errors["user.postcode"]
                    )
                ) {
                    setState({
                        ...state,
                        currentStep: 1
                    });

                    SweetAlert.fire({ title: error.response.data.message, text: "Please Try Again", icon: "warning" });
                    return
                }
                else if (
                    (currentStep >= 2)
                    &&
                    (
                        errors["garage.name"]
                        ||
                        errors["garage.about"]
                        ||
                        errors["garage.web_page"]
                        ||
                        errors["garage.phone"]
                        ||
                        errors["garage.email"]
                        ||
                        errors["garage.additional_information"]
                        ||
                        errors["garage.country"]
                        ||
                        errors["garage.city"]
                        ||
                        errors["garage.postcode"]
                        ||
                        errors["garage.address_line_1"]
                        ||
                        errors["garage.address_line_2"]
                        ||
                        errors["garage.logo"]
                        ||
                        errors["garage.is_mobile_garage"]
                        ||
                        errors["garage.wifi_available"]
                        ||
                        errors["garage.labour_rate"]
                        ||
                        errors["garage.average_time_slot"]
                    )
                ) {
                    setState({
                        ...state,
                        currentStep: 2
                    });
                    SweetAlert.fire({ title: error.response.data.message, text: "Please Try Again", icon: "warning" });
                    return
                }
                else if (
                    (currentStep >= 3)
                    &&
                    (
                        errors["service.makes"]
                        ||
                        errors["service.services"]
                    )
                ) {
                    setState({
                        ...state,
                        currentStep: 3
                    });

                    SweetAlert.fire({ title: error.response.data.message, text: "Please Try Again", icon: "warning" });
                    return
                }
                else {
                    console.log("errors", errors)
                    setServerSideErrors(null)
                    _next()
                }
            }
            else if (error.response?.status == 401) {
                SweetAlert.fire({ title: error.response.data.message, text: "Hello!!! You do not have permission.", icon: "warning" });
            }
            else {
                SweetAlert.fire({ title: "something went wrong!!", text: "Please Try Again", icon: "warning" });
            }

            console.log("garage_err", error)
        })
    };
    return (
        <Fragment>
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <h3 className="text-center font-weight-bold text-primary">Create Account</h3>
                                </CardHeader>
                                <CardBody>
                                    <CardTitle>
                                        <MultiStepProgressBar currentStep={state.currentStep} />
                                    </CardTitle>
                                    <CardText />
                                    <UserStep
                                        currentStep={state.currentStep}
                                        handleChange={handleUserChange}
                                        data={user}
                                        serverSideErrors={serverSideErrors}
                                    />
                                    <GarageStep
                                        currentStep={state.currentStep}
                                        handleChange={handleGarageChange}
                                        data={garage}
                                        serverSideErrors={serverSideErrors}
                                    />

                                    <ServiceStep
                                        currentStep={state.currentStep}
                                        handleChange={handleUserChange}
                                        data={service}
                                        serverSideErrors={serverSideErrors}
                                        addCategory={addCategory}
                                        automobileCategories={automobileCategories}
                                        handleCategoryChange={handleCategoryChange}
                                        handleMakeChange={handleMakeChange}
                                        handleModelChange={handleModelChange}
                                        handleServiceChange={handleServiceChange}
                                        handleSubServiceChange={handleSubServiceChange}
                                    />
                                    <div>
                                        Already Have An Account? <span role="button" className='text-primary' onClick={() => { history.push(`${process.env.PUBLIC_URL}/login`) }}>Login.</span>
                                    </div>
                                </CardBody>
                                <CardFooter>

                                    {previousButton()}
                                    {nextButton()}
                                    {submitButton()}
                                </CardFooter>

                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};