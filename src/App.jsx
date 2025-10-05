import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ErrorBoundary from "./components/UI/ErrorBoundary";

const Sidebar = lazy(() => import("./components/Sidebar/Sidebar"));
const KonvaCanvas = lazy(() => import("./components/Canvas/KonvaCanvas"));
const Toolbar = lazy(() => import("./components/Toolbar/Toolbar"));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <div className="flex flex-col h-screen bg-gray-50">
          <Suspense
            fallback={
              <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
            }
          >
            <Toolbar />
          </Suspense>

          <div className="flex flex-1 overflow-hidden">
            <Suspense
              fallback={
                <div className="w-80 bg-white border-r border-gray-200 animate-pulse" />
              }
            >
              <Sidebar />
            </Suspense>

            <div className="flex-1 relative">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading canvas...</p>
                    </div>
                  </div>
                }
              >
                <KonvaCanvas />
              </Suspense>
            </div>
          </div>
        </div>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
