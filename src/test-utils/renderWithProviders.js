import React from "react";
import { BrowserRouter } from "react-router";
import { RootStoreContext } from "../stores/RootStoreContext";
import { render } from "@testing-library/react";
import StatusBanner from "../components/StatusBanner";

export function renderWithProviders(ui, { stores = {}, route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);
  const Wrapper = ({ children }) => (
    <RootStoreContext.Provider value={stores}>
      <BrowserRouter>{children}</BrowserRouter>
    </RootStoreContext.Provider>
  );
  return render(ui, { wrapper: Wrapper });
}
