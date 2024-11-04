# File Browser and Upload Application

## Overview
This application allows users to browse directories and upload files to a specified location in a GitHub repository. It consists of a front-end built with HTML and JavaScript, and a back-end powered by Node.js and Express.

## Features
- Browse through directories in a GitHub repository.
- Upload files to specific directories.
- Display error messages for failed uploads or fetch requests.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **File Upload**: Multer
- **API Calls**: Axios
- **CORS**: To handle cross-origin requests

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A GitHub account with a personal access token.
- Access to a GitHub repository to upload files.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. **Install Dependencies Navigate to the server directory and install the required packages:**

  ```bash
  cd server
  npm install
  ```
3. **Configure the Server Open the server.js file and replace the placeholders with your GitHub username and repository details:**

  ```javascript
  const GITHUB_USERNAME = 'your-github-username'; // Your GitHub username
  const GITHUB_REPO = 'your-repository-name'; // Your GitHub repository name
  const token = 'your-personal-access-token'; // Your GitHub Personal Access Token
  ```
4.**Start the Server In the terminal, run:**

  ```bash
  node server.js
  ```
The server will start on http://localhost:3000.

Open the Frontend Open the index.html file in your web browser.

## Usage
Use the directory list to navigate through your GitHub repository.
Select a file to upload and choose the desired directory path.
Click the "Upload" button to upload the file.
## Troubleshooting
Ensure that your personal access token has the correct permissions to access and modify the repository.
Check the console for any error messages related to API calls.

## Acknowledgements
Thanks to the open-source community for providing valuable tools and libraries.

## Instructions for Use:
Replace <repository-url> with the URL of your GitHub repository.
Update the GitHub username, repository name, and personal access token in the setup section.
Add any additional notes or usage examples that might be specific to your application.

