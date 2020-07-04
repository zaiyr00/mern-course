import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import LinksPage from "./pages/LinksPage";
import CreatePage from "./pages/CreatePage";
import DetailPage from "./pages/DetailPage";
import AuthPage from "./pages/AuthPage";

const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <div>
                <Switch>
                    <Route path="/links" exact>
                        <LinksPage />
                    </Route>
                    <Route path="/create" exact>
                        <CreatePage/>
                    </Route>
                    <Route path="/detail/:id">
                        <DetailPage />
                    </Route>
                    <Redirect to="/create"/>
                </Switch>
            </div>
        );
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/"/>
        </Switch>
    )

};

export default useRoutes;