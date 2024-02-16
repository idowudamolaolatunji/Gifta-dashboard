import React from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom'
import StepProgressBar from 'react-step-progress';
import 'react-step-progress/dist/index.css';


function KycVer() {

    const navigate = useNavigate();


    const step1Content = <h1>Step 1 Content</h1>;
    const step2Content = <h1>Step 2 Content</h1>;
    
    // setup step validators, will be called before proceeding to the next step
    function step1Validator() {
    // return a boolean
    return true
    }
    
    function step2Validator() {
    // return a boolean
    return true
    }
    
    function onFormSubmit() {
    // handle the submit logic here
    // This function will be executed at the last step
    // when the submit button (next button in the previous steps) is pressed
    }

    return (
        <>

            <Header />


            <section className="product__section section">
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    <div className="terms--container">
                        <h3 className="terms--heading">KYC Verification</h3>


                        <div className="modal--info">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nam suscipit reprehenderit ab quos ipsum sequi iusto expedita iste inventore illo, fugiat, hic voluptatum aut eum ipsam nisi quis, porro qui possimus saepe? Eligendi pariatur quos ad totam aperiam tempora eaque labore eveniet enim voluptatibus itaque ab nisi, doloremque vel?</div>


                        <StepProgressBar 
                            startingStep={0}
                            onSubmit={onFormSubmit}
                            wrapperClass='stepper--wrapper'
                            contentClass='stepper--content'
                            progressClass='stepper--progress'
                            stepClass='stepper--step'
                            steps={[
                              {
                                label: 'Step 1',
                                // subtitle: '10%',
                                // name: 'step 1',
                                content: step1Content,
                                validator: step2Validator
                              },
                              {
                                label: 'Step 2',
                                // subtitle: '50%',
                                // name: 'step 2',
                                content: step2Content,
                                validator: onsubmit
                              },
                              
                            ]}
                        
                        />

                    </div>
                </div>
            </section>
        </>
    )
}

export default KycVer
