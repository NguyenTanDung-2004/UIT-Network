#!/bin/bash

echo "Starting all services in separate Visual Studio Code terminals..."

# Function to run a service in a new Visual Studio Code terminal
run_service() {
    local service_name=$1
    local service_path=$2

    echo "Starting $service_name in a new Visual Studio Code terminal..."
    code --new-window "$service_path" # Open the service folder in a new VS Code window
    osascript <<EOF
        tell application "Visual Studio Code"
            activate
            delay 1
            tell application "System Events"
                keystroke "j" using {command down, control down} -- Open terminal in VS Code
                delay 1
                keystroke "cd $service_path && ./mvnw spring-boot:run"
                key code 36 -- Press Enter
            end tell
        end tell
EOF
    echo "$service_name started in a new Visual Studio Code terminal."
}

# Start PostService
run_service "PostService" "/Users/honghanlenguyen/Documents/TaiLieuCuaTanDung/UIT-Network/PostService"

# Start UserService
run_service "UserService" "/Users/honghanlenguyen/Documents/TaiLieuCuaTanDung/UIT-Network/UserService"

# Add more services as needed
# Example:
# run_service "AnotherService" "/path/to/AnotherService"

echo "All services started successfully in separate Visual Studio Code terminals!"