/* Add these to your existing CSS */
button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

@keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
}

.loading-text {
    animation: pulse 1.5s infinite;
    color: #666;
}

#original-text:empty::before, 
#translated-text:empty::before {
    content: "No content yet";
    color: #999;
    font-style: italic;
}