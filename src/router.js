import { ROUTERS } from "./utils/Router/router";
import HomePage from "./pages/homePage";
import {Route, Routes} from "react-router-dom";
import MasterLayout from "./pages/theme/masterLayout";
import Profile from "./pages/Profile";
import ProductPage from "./pages/productPage";
import ShoppingCart from "./pages/shoppingCart";
import Checkout from "./pages/CheckOut";
import ProductDetail, {loadProduct} from "./pages/ProductDetail";
import ContactPage from "./pages/contactPage";
import ReviewPage from "./pages/reviewPage";
import Login from "./pages/login";
import Admin from "./pages/admin/admin";


function RenderRouter() {
    const pageRouter = [
        {
            path: ROUTERS.pages.home,
            component: <HomePage />,
        },
        {
            path: ROUTERS.pages.profile,
            component: <Profile />,
        },
        {
            path: ROUTERS.pages.PRODUCTS,
            component: <ProductPage />,
        },
        {
            path: ROUTERS.pages.DETAIL,
            component: <ProductDetail />,
            loader: loadProduct,
        },
        {
            path: ROUTERS.pages.CART,
            component: <ShoppingCart />,
        },
        {
            path: ROUTERS.pages.Checkout,
            component: <Checkout />,
        },
        {
            path: ROUTERS.pages.REVIEW,
            component: <ReviewPage />,
        },
        {
            path: ROUTERS.pages.CONTACT,
            component: <ContactPage />,
        },
        {
            path: ROUTERS.pages.LOGIN,
            component: <Login/>,
        },

    ];

    return (
        <MasterLayout>
            <Routes>
                {pageRouter.map((item, key) => (
                    <Route key={key} path={item.path} element={item.component}/>
                ))}
            </Routes>
        </MasterLayout>
    );
}

const RouterCustom = () => {
    return <RenderRouter />;
};

export default RouterCustom;