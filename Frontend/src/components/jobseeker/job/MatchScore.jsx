import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Award, Zap } from "lucide-react";

const EnhancedProgressBar = ({
  matchScore = 0,
  isMatchScoreLoading = false,
  animationDuration = 1500,
  animationDelay = 300,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animate score counter when matchScore changes
  useEffect(() => {
    if (!isMatchScoreLoading && matchScore > 0 && !hasAnimated) {
      // Add delay before starting animation
      const delayTimer = setTimeout(() => {
        const steps = 60;
        const increment = matchScore / steps;
        let current = 0;

        const animationTimer = setInterval(() => {
          current += increment;
          if (current >= matchScore) {
            setAnimatedScore(matchScore);
            setHasAnimated(true);
            clearInterval(animationTimer);
          } else {
            setAnimatedScore(Math.floor(current));
          }
        }, animationDuration / steps);

        return () => clearInterval(animationTimer);
      }, animationDelay);

      return () => clearTimeout(delayTimer);
    } else if (isMatchScoreLoading) {
      // Reset animation state when loading starts
      setAnimatedScore(0);
      setHasAnimated(false);
    }
  }, [
    matchScore,
    isMatchScoreLoading,
    animationDuration,
    animationDelay,
    hasAnimated,
  ]);

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "from-emerald-400 to-emerald-600";
    if (score >= 60) return "from-amber-400 to-amber-600";
    if (score >= 40) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Award className="h-5 w-5" />;
    if (score >= 60) return <TrendingUp className="h-5 w-5" />;
    if (score >= 40) return <Zap className="h-5 w-5" />;
    return <Target className="h-5 w-5" />;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Job Match";
    if (score >= 60) return "Good Job Match";
    if (score >= 40) return "Fair Job Match";
    return "Poor Job Match";
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getProgressColor(
            animatedScore
          )} shadow-lg mb-3 transition-all duration-500`}
        >
          <div className="text-white">
            {isMatchScoreLoading ? (
              <div className="animate-spin">
                <Target className="h-6 w-6" />
              </div>
            ) : (
              getScoreIcon(animatedScore)
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {isMatchScoreLoading
            ? "Analyzing Job Match..."
            : getScoreLabel(animatedScore)}
        </h3>

        <div
          className={`text-3xl font-bold ${getMatchScoreColor(
            animatedScore
          )} transition-colors duration-500`}
        >
          {isMatchScoreLoading ? (
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          ) : (
            `${animatedScore}%`
          )}
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="relative">
        {/* Background Track */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Animated Progress Fill */}
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(
              animatedScore
            )} transition-all duration-1000 ease-out relative overflow-hidden`}
            style={{ width: `${isMatchScoreLoading ? 0 : animatedScore}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

            {/* Moving Highlight */}
            {!isMatchScoreLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Score Markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 ${
            isMatchScoreLoading
              ? "bg-gray-100 text-gray-600"
              : animatedScore >= 80
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : animatedScore >= 60
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : animatedScore >= 40
              ? "bg-orange-100 text-orange-700 border border-orange-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isMatchScoreLoading
                ? "bg-gray-400 animate-pulse"
                : animatedScore >= 80
                ? "bg-emerald-500"
                : animatedScore >= 60
                ? "bg-amber-500"
                : animatedScore >= 40
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
          ></div>
          <span>
            {isMatchScoreLoading ? "Processing..." : "Job Match Complete"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProgressBar;

// Example usage - remove this section when using the component
const ExampleUsage = () => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setScore(85); // Example score
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Enhanced Progress Bar Examples
        </h1>

        {/* Main Example */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Dynamic Score Example
          </h2>
          <EnhancedProgressBar
            matchScore={score}
            isMatchScoreLoading={loading}
            animationDuration={2000}
            animationDelay={500}
          />
        </div>

        {/* Quick Test Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScore(95);
              }, 1000);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Excellent (95%)
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScore(72);
              }, 1000);
            }}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Good (72%)
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScore(45);
              }, 1000);
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Fair (45%)
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScore(28);
              }, 1000);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Poor (28%)
          </button>
        </div>

        {/* Static Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div>
            <h3 className="text-md font-medium mb-3 text-gray-600">
              Excellent Job Match
            </h3>
            <EnhancedProgressBar matchScore={92} isMatchScoreLoading={false} />
          </div>
          <div>
            <h3 className="text-md font-medium mb-3 text-gray-600">
              Loading State
            </h3>
            <EnhancedProgressBar matchScore={0} isMatchScoreLoading={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

// export default ExampleUsage;
