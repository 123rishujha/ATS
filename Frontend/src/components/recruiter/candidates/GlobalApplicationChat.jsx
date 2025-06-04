import React, { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { useGetRecruiterJobPostsQuery } from "../RecruiterQuery";
import { main_backend_url } from "@/imports/mainExports";
import { Send, MessageCircle, Briefcase, Bot, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GlobalApplicationChat = () => {
  const [selectedJobPostId, setSelectedJobPostId] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetRecruiterJobPostsQuery();

  const jobPosts = data?.data || [];
  const selectedJob = jobPosts.find((job) => job._id === selectedJobPostId);

  const handleChat = async () => {
    if (!userInput.trim() || !selectedJobPostId) {
      alert("Please select a job post and enter a query.");
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setUserInput("");

    try {
      const res = await fetch(
        `${main_backend_url}api/ai/chat/global/${selectedJobPostId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: userInput,
          }),
        }
      );

      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error", err);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              AI Recruitment Assistant
            </h1>
            <p className="text-muted-foreground text-sm">
              Chat with AI to find the perfect candidates
            </p>
          </div>
        </div>

        {/* Job Selection */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <label className="font-medium text-sm text-foreground">
              Active Job Post
            </label>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <Select
              value={selectedJobPostId}
              onValueChange={setSelectedJobPostId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job post to start chatting..." />
              </SelectTrigger>
              <SelectContent>
                {jobPosts.map((job) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedJob && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-primary font-medium">
                Currently analyzing: {selectedJob.title}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="w-12 h-12 mb-3 text-primary/50" />
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">
                Ask me anything about your job applications!
              </p>
              <div className="mt-4 text-xs bg-card p-3 rounded-lg border max-w-md">
                <p className="font-medium mb-1">Try asking:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>"Show me candidates with React experience"</li>
                  <li>
                    "Find applicants with salary expectations under 10 LPA"
                  </li>
                  <li>"List candidates with 2+ years experience"</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-2xl ${
                      message.type === "user" ? "order-2" : ""
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.isError
                          ? "bg-destructive/10 border border-destructive/20 text-destructive"
                          : "bg-card border text-card-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-right text-muted-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <div className="flex-shrink-0 order-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="bg-card border p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t">
          {chatHistory.length > 0 && (
            <div className="flex justify-end mb-3">
              <Button
                onClick={clearChat}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Chat
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                rows="2"
                className="w-full border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                placeholder="Ask about candidates, skills, salary expectations..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!selectedJobPostId}
              />
            </div>
            <Button
              onClick={handleChat}
              disabled={loading || !userInput.trim() || !selectedJobPostId}
              className="px-6 py-3"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>

          {!selectedJobPostId && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select a job post above to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalApplicationChat;
