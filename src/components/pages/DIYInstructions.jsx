import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { giftService } from "@/services/api/giftService";
import { toast } from "react-toastify";

const DIYInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [instructions, setInstructions] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [completedSteps, setCompletedSteps] = React.useState(new Set());
  const [showMaterials, setShowMaterials] = React.useState(true);

  React.useEffect(() => {
    loadInstructions();
  }, [id]);

  const loadInstructions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await giftService.generateDIYInstructions(parseInt(id));
      setInstructions(data);
    } catch (err) {
      setError("Failed to load DIY instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'accent';
      case 'advanced': return 'primary';
      default: return 'secondary';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'Smile';
      case 'intermediate': return 'Zap';
      case 'advanced': return 'Flame';
      default: return 'Star';
    }
  };

  const handleSaveProject = () => {
    toast.success("DIY project saved to your collection!");
  };

  const handleShareProject = () => {
    toast.success("Project link copied to clipboard!");
  };

  if (loading) return <Loading message="Loading DIY instructions..." />;
  if (error) return <Error message={error} onRetry={loadInstructions} />;
  if (!instructions) return <Error message="DIY instructions not found" onRetry={() => navigate(-1)} />;

  const progressPercentage = (completedSteps.size / instructions.steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            icon="ArrowLeft" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back to Gifts
          </Button>
          
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white">
              <ApperIcon name="Hammer" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {instructions.gift.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {instructions.gift.reasoning}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={getDifficultyColor(instructions.difficulty)} size="lg">
                  <ApperIcon name={getDifficultyIcon(instructions.difficulty)} size={16} />
                  {instructions.difficulty}
                </Badge>
                <Badge variant="outline" size="lg">
                  <ApperIcon name="Clock" size={16} />
                  {instructions.timeEstimate}
                </Badge>
                <Badge variant="accent" size="lg">
                  <ApperIcon name="DollarSign" size={16} />
                  ${instructions.gift.price}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" icon="Bookmark" onClick={handleSaveProject}>
            Save Project
          </Button>
          <Button variant="secondary" icon="Share2" onClick={handleShareProject}>
            Share
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">
            {completedSteps.size} of {instructions.steps.length} steps completed
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600 font-medium">{Math.round(progressPercentage)}% Complete</span>
          {progressPercentage === 100 && (
            <Badge variant="success" size="sm">
              <ApperIcon name="CheckCircle" size={14} />
              Completed!
            </Badge>
          )}
        </div>
      </Card>

      {/* Materials & Tools Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">What You'll Need</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowMaterials(!showMaterials)}
          icon={showMaterials ? "ChevronUp" : "ChevronDown"}
        >
          {showMaterials ? "Hide" : "Show"} Materials
        </Button>
      </div>

      {/* Materials & Tools */}
      {showMaterials && (
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {/* Materials */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ApperIcon name="Package" size={20} />
              <span>Materials</span>
            </h3>
            <div className="space-y-3">
              {instructions.materials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${material.essential ? 'bg-red-500' : 'bg-gray-400'}`} />
                    <span className="text-gray-900">{material.item}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{material.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <ApperIcon name="Info" size={14} className="inline mr-1" />
                Red dots indicate essential materials
              </p>
            </div>
          </Card>

          {/* Tools */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ApperIcon name="Wrench" size={20} />
              <span>Tools Needed</span>
            </h3>
            <div className="space-y-3">
              {instructions.tools.map((tool, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ApperIcon name="Tool" size={16} className="text-gray-600" />
                  <span className="text-gray-900">{tool}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step-by-Step Instructions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Step-by-Step Instructions</h2>
        
        <div className="space-y-6">
          {instructions.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-l-4 ${completedSteps.has(index) ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => toggleStepComplete(index)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      completedSteps.has(index)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <ApperIcon name="Check" size={16} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${completedSteps.has(index) ? 'text-green-800' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <Badge variant="outline" size="sm">
                        <ApperIcon name="Clock" size={12} />
                        {step.duration}
                      </Badge>
                    </div>
                    
                    <p className={`text-gray-600 mb-4 ${completedSteps.has(index) ? 'line-through opacity-60' : ''}`}>
                      {step.description}
                    </p>
                    
                    {/* Step Image */}
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <div className="w-full h-48 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ApperIcon name="Image" size={48} className="mx-auto mb-2" />
                          <p className="text-sm">Instructional Image</p>
                          <p className="text-xs opacity-60">{step.image}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tips */}
                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center space-x-1">
                          <ApperIcon name="Lightbulb" size={14} />
                          <span>Tips</span>
                        </h4>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-yellow-700 flex items-start space-x-2">
                              <span className="text-yellow-500">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completion Card */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Trophy" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                <p className="text-green-100 mb-4">
                  You've completed your DIY {instructions.gift.title}. Great work!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" className="bg-white text-green-600 border-white hover:bg-green-50">
                    Share Your Creation
                  </Button>
                  <Button variant="ghost" className="text-white border-white hover:bg-white hover:bg-opacity-20">
                    Start Another Project
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DIYInstructions;