import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppContextProvider from "./contexts/AppContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SearchContextProvider } from "./contexts/SearchContext";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </AppContextProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </BrowserRouter>
);
