import { ROUTERS } from "./utils/Router/router";
import HomePage from "./pages/homePage";
import {Route, Routes} from "react-router-dom";
import MasterLayout from "./pages/theme/masterLayout";
import Profile from "./pages/Profile";
import ProductPage from "./pages/productPage";
import ShoppingCart from "./pages/shoppingCart";
import Checkout from "./pages/CheckOut";
import ProductDetail from "./pages/ProductDetail";
import ContactPage from "./pages/contactPage";
import ReviewPage from "./pages/reviewPage";
import Login from "./pages/login";
import Admin from "./pages/admin/admin";
import  AdminLayout from "./pages/theme/adminLayout";
import ProtectedRoute from './component/ProtectedRoute';

function RenderRouter() {
    const pageRouter = [
        {
            path: ROUTERS.pages.ADMIN,
            component: <Admin />,
            layout: AdminLayout,
            protected: true,
        },
        {
            path: ROUTERS.pages.home,
            component: <HomePage />,
            layout: MasterLayout,  // Layout mặc định cho Home
        },
        {
            path: ROUTERS.pages.profile,
            component: <Profile />,
            layout: MasterLayout,  // Layout mặc định cho Profile
        },
        {
            path: ROUTERS.pages.PRODUCTS,
            component: <ProductPage />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.DETAIL,
            component: <ProductDetail />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.CART,
            component: <ShoppingCart />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.Checkout,
            component: <Checkout />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.REVIEW,
            component: <ReviewPage />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.CONTACT,
            component: <ContactPage />,
            layout: MasterLayout,
        },
        {
            path: ROUTERS.pages.LOGIN,
            component: <Login />,
            layout: MasterLayout,
        },


    ];


    return (

            <Routes>
                {pageRouter.map((item, key) => (
                    <Route
                        key={key}
                        path={item.path}
                        element={
                            item.layout ? (
                                <item.layout>
                                    {item.protected ? (
                                        <ProtectedRoute>{item.component}</ProtectedRoute> // Bảo vệ route admin
                                    ) : (
                                        item.component
                                    )}
                                </item.layout>
                            ) : item.protected ? (
                                <ProtectedRoute>{item.component}</ProtectedRoute> // Bảo vệ route admin
                            ) : (
                                item.component
                            )
                        }
                    />
                ))}
            </Routes>

    );
}

const RouterCustom = () => {
    return <RenderRouter />;
};

export default RouterCustom;