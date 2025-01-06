import React, {memo, useState} from 'react'
import Header from "../header";
import Footer from "../footer";
import Admin from "../../admin/admin";
const MasterLayout = ({ children, ...props}) => {

    return (

        <div {...props}>

           {/* <Admin/>*/}
            <Header/>
            {children}
            <Footer />
        </div>
    );
};
export default memo(MasterLayout);