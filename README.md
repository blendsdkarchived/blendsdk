[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# BlendSDK

Blend is a component based framework for developing single-page web and mobile
applications in TypeScript. It is entirely class-based, and make extensive use of
object-oriented facilities and interfaces in TypeScript.

The components within Blend are event driven and communicate with each other either
directly by listening and consuming events or though a model-view-controller architecture.

Blend provides various API for creating self-contained UI components that can be
stacked or composed together for creating large data-driven applications. The framework
does not have a particular markup language for creating DOM elements and CSS styles. As a
developer you have the option to create your components entirely using the provided API.

## Packages

The core framework consists of the following packages:

-   **Core**: This package provides common utilities and language helpers.

-   **Ajax**: This package provides classes for communicating with a back-end server.

-   **CSS**: This packages provides classes for generating and rendering dynamic CSS and stylesheets.

-   **DeviceInfo**: This package provides functionality for browser and device detection.

-   **DOM**: This package provides functionality for creating and manipulating DOM elements.

-   **Browser**: This package provides functionality for communicating with the browser to handle browser events.

-   **Extensions**: This packages provides several extensions and augment on top of the built-in browser objects.

-   **Form**: This package provides functionality for developing form components and asynchronous data validation.

-   **ICON**: This package provides classes for creating and hosting both SVG and image based icons.

-   **MVC**: This package provides functionality for creating event-driven components, controllers, and data stores.

-   **Router**: This package provides classes to work with hash based URLs.

-   **Task**: This package provides classes for crating and running asynchronous tasks.

-   **UI**: This package provides classes for creating self-contained UI and Style components.

-   **UIStack**: This packages provides a component that allows you to stack UI components on top of each other and show a single one at a time.

-   **ViewRouter**: This package provides a component that utilizes the Router and UIStack and provides functionality to create virtual pages within an application.

-   **Application**: This package provides a component that is used to bootstrap and startup a Blend based application.

## Current State

The packages mentioned above are all in beta-plus state. This means that everything works as it should and
except for bug-fixing, and incrementally adding documentation, there are no fundamental changes anymore.
