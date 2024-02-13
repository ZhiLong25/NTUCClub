import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import "../styles/query.css"

function ViewReplies() {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    // Fetch replies from the server
    http.get('/Query')  // Adjust the API endpoint based on your server implementation
      .then((res) => {
        setReplies(res.data);
      })
      .catch((error) => {
        console.error('Error fetching replies:', error);
        toast.error('Failed to fetch replies');
      });
  }, []);

  return (
    <div style={{ height: "90dvh" }}>
      <div style={{ height: "100%" }}>
    
        <Card style={{ height: "80%", marginTop: "5%", overflow: "hidden", overflowY: "scroll" }}>
          <div style={{ overflowY: "scroll", height: "100%" }}>
          {replies.map((reply) => (
              // Add a condition to check if QueryReply is "NotReplied" before rendering
              reply.queryReply !== "NotReplied" && (
                <Grid key={reply.id}>
                  <div style={{
                      background: "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",

                      boxShadow: "4px 4px 8px rgba(255, 99, 71, 0.5)", marginBottom: "5%", height: "3%", width: "100%"
                    }}>
                    <Card>
                      <div style={{ height: '4%', display: 'flex', flexDirection: 'row' }}>
                        <CardContent style={{ margin: 'auto', flex: '2' }}>
                          {/* Render reply information */}
                          <p><strong>Email:</strong> {reply.email}</p>
                          <p><strong>Subject:</strong> {reply.querySubject}</p>
                          <p><strong>Description:</strong> {reply.queryDescription}</p>
                          {/* Add reply field */}
                          <p><strong>Reply:</strong> {reply.queryReply}</p>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </Grid>
              )
            ))}
          </div>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ViewReplies;