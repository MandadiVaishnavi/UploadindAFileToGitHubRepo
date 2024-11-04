const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());

// Replace with your GitHub username
const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME'; // Your GitHub username
const REPOSITORY_NAME = 'YOUR_REPOSITORY_NAME'; // Name of your GitHub repository

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to get the username dynamically from the token
async function getGitHubUsername(accessToken) {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.login;
    } catch (error) {
        console.error('Error fetching username:', error.message);
        throw new Error('Failed to retrieve GitHub username');
    }
}

// Function to upload a file to a specified path in a repository
async function uploadFileToGitHub({ repository, branch = 'main', uploadPath, accessToken, fileBuffer }) {
    try {
        const owner = await getGitHubUsername(accessToken);
        const content = fileBuffer.toString('base64');

        const getUrl = `https://api.github.com/repos/${owner}/${repository}/contents/${uploadPath}?ref=${branch}`;
        
        let sha = null;
        try {
            const response = await axios.get(getUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            sha = response.data.sha; // Get the SHA if the file exists
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error checking file existence:', error.response?.data?.message || error.message);
                throw new Error('Failed to check file existence');
            }
        }

        const data = {
            message: `Add file at ${uploadPath}`,
            content: content,
            branch: branch,
        };

        if (sha) {
            data.sha = sha; // Update the existing file
        }

        const url = `https://api.github.com/repos/${owner}/${repository}/contents/${uploadPath}`;
        const response = await axios.put(url, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('File uploaded successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload failed:', error.response?.data?.message || error.message);
        throw new Error('Upload failed');
    }
}

// Function to get directory contents
const getDirectoryContents = async (path = '') => {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPOSITORY_NAME}/contents/${path}`;
    const response = await axios.get(url);
    return response.data;
};

// Endpoint to fetch directory contents
app.get('/api/contents', async (req, res) => {
    const path = req.query.path || '';
    
    try {
        const contents = await getDirectoryContents(path);
        res.json(contents);
    } catch (error) {
        console.error('Error fetching directory contents:', error.message);
        res.status(500).json({ error: 'Failed to fetch directory contents' });
    }
});

// Endpoint to upload a file
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const { path: uploadDirectory } = req.body; // Get the upload directory from the form data
    const accessToken = 'YOUR_GITHUB_ACCESS_TOKEN'; // Replace with your GitHub access token

    console.log('File upload request received');
    console.log('Uploaded file:', req.file);
    console.log('Upload directory path:', uploadDirectory);

    // Construct the full path including the file name
    const uploadPath = `${uploadDirectory}/${req.file.originalname}`;

    try {
        console.log('File path for upload:', uploadPath); // Log the complete file path

        const result = await uploadFileToGitHub({
            repository: REPOSITORY_NAME, // Repository name
            branch: 'main', // Branch name (can also be made a parameter)
            uploadPath: uploadPath, // Full path including file name
            accessToken: accessToken, // GitHub Personal Access Token
            fileBuffer: req.file.buffer, // Buffer from the uploaded file
        });
        res.json(result);
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).json({ error: 'Failed to upload the file' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
