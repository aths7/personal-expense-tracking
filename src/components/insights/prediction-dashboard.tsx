'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Calendar,
  Target,
  BarChart3,
  Brain,
  Zap,
  DollarSign,
  Clock,
  Shield,
  TrendingDown
} from 'lucide-react';

import { AnimatedCard } from '@/components/ui/animated-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { expensePredictionService } from '@/services/expense-prediction';
import { formatCurrency } from '@/lib/currency';

interface PredictionCardProps {
  prediction: {
    amount: number;
    confidence: number;
    category: string;
    reasoning: string;
    historicalBasis: {
      averageAmount: number;
      frequency: number;
      lastAmount: number;
      trend: string;
    };
  };
  onAccept?: () => void;
  onDismiss?: () => void;
}

function PredictionCard({ prediction, onAccept, onDismiss }: PredictionCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <AnimatedCard className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg font-semibold">{prediction.category}</div>
                <Badge className={getConfidenceColor(prediction.confidence)}>
                  {getConfidenceLabel(prediction.confidence)}
                </Badge>
              </div>
              
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(prediction.amount)}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{prediction.reasoning}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Avg: {formatCurrency(prediction.historicalBasis.averageAmount)}</span>
                <span>Freq: {prediction.historicalBasis.frequency.toFixed(1)}/month</span>
                <span className={`capitalize ${
                  prediction.historicalBasis.trend === 'increasing' ? 'text-red-500' :
                  prediction.historicalBasis.trend === 'decreasing' ? 'text-green-500' :
                  'text-gray-500'
                }`}>
                  {prediction.historicalBasis.trend}
                </span>
              </div>
            </div>
            
            <div className="ml-4">
              <ProgressRing
                progress={prediction.confidence * 100}
                size={50}
                strokeWidth={4}
                color={prediction.confidence >= 0.8 ? '#10b981' : prediction.confidence >= 0.6 ? '#f59e0b' : '#ef4444'}
                showText={true}
                text={`${Math.round(prediction.confidence * 100)}%`}
              />
            </div>
          </div>
          
          {(onAccept || onDismiss) && (
            <div className="flex gap-2 mt-4">
              {onAccept && (
                <Button size="sm" variant="outline" onClick={onAccept}>
                  Track It
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </AnimatedCard>
    </motion.div>
  );
}

function AlertCard({ alert }: { alert: { type: string; message: string; projectedOverage?: number; confidence: number } }) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Shield className="w-5 h-5 text-yellow-500" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
        <div className="flex items-start gap-3">
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            <div className="font-medium text-gray-900">{alert.message}</div>
            {alert.projectedOverage && alert.projectedOverage > 0 && (
              <div className="text-sm font-medium text-red-600 mt-1">
                Overage: {formatCurrency(alert.projectedOverage)}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Confidence: {Math.round(alert.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PredictionDashboard() {
  const [predictions, setPredictions] = useState<Array<Record<string, unknown>>>([]);
  const [alerts, setAlerts] = useState<Array<Record<string, unknown>>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [patterns, setPatterns] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('predictions');

  useEffect(() => {
    loadPredictionData();
  }, []);

  const loadPredictionData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockPredictions = [
        {
          category: 'Food & Dining',
          amount: 450,
          confidence: 0.85,
          reasoning: 'Based on frequent spending pattern, typically spent on weekdays',
          historicalBasis: {
            averageAmount: 380,
            frequency: 12.5,
            lastAmount: 520,
            trend: 'increasing'
          }
        },
        {
          category: 'Transportation',
          amount: 120,
          confidence: 0.72,
          reasoning: 'Based on weekly commute pattern, high historical consistency',
          historicalBasis: {
            averageAmount: 100,
            frequency: 8.2,
            lastAmount: 140,
            trend: 'stable'
          }
        },
        {
          category: 'Entertainment',
          amount: 800,
          confidence: 0.65,
          reasoning: 'Based on weekend spending pattern, increasing trend',
          historicalBasis: {
            averageAmount: 680,
            frequency: 4.1,
            lastAmount: 900,
            trend: 'increasing'
          }
        }
      ];

      const mockAlerts = [
        {
          type: 'warning',
          message: 'Approaching monthly budget limit (87%)',
          confidence: 0.9,
          projectedOverage: 0
        },
        {
          type: 'danger',
          message: 'Food & Dining spending may exceed budget by ₹2,250',
          category: 'Food & Dining',
          confidence: 0.8,
          projectedOverage: 2250
        }
      ];

      const mockSuggestions = [
        'Consider setting a monthly limit for Food & Dining (avg: ₹380/expense)',
        'Your Entertainment spending is trending upward - review recent purchases',
        'You typically spend on Transportation on Monday and Friday - plan accordingly',
        'Track your daily expenses to identify micro-spending patterns'
      ];

      const mockPatterns = [
        {
          categoryName: 'Food & Dining',
          averageAmount: 380,
          frequency: 12.5,
          trend: 'increasing',
          dayOfWeek: [1, 2, 3, 4, 5],
          confidence: 0.85
        },
        {
          categoryName: 'Transportation',
          averageAmount: 100,
          frequency: 8.2,
          trend: 'stable',
          dayOfWeek: [1, 5],
          confidence: 0.78
        }
      ];

      setPredictions(mockPredictions);
      setAlerts(mockAlerts);
      setSuggestions(mockSuggestions);
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Error loading prediction data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Smart Insights
          </h2>
          <p className="text-gray-600">AI-powered spending predictions and recommendations</p>
        </div>
        <Button onClick={loadPredictionData} className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Refresh Insights
        </Button>
      </div>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} alert={alert as { type: string; message: string; projectedOverage?: number; confidence: number }} />
          ))}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Next 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.slice(0, 3).map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{String(prediction.category)}</div>
                        <div className="text-sm text-gray-500">
                          {Math.round(Number(prediction.confidence) * 100)}% confidence
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {formatCurrency(Number(prediction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Predicted:</span>
                    <span className="font-semibold">
                      {formatCurrency(predictions.reduce((sum, p) => sum + Number(p.amount), 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Confidence Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Confidence</span>
                    <span className="text-green-600 font-medium">
                      {predictions.filter(p => Number(p.confidence) >= 0.8).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Confidence</span>
                    <span className="text-yellow-600 font-medium">
                      {predictions.filter(p => Number(p.confidence) >= 0.6 && Number(p.confidence) < 0.8).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Confidence</span>
                    <span className="text-red-600 font-medium">
                      {predictions.filter(p => Number(p.confidence) < 0.6).length}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Average Confidence</div>
                  <Progress 
                    value={(predictions.reduce((sum, p) => sum + Number(p.confidence), 0) / predictions.length) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </AnimatedCard>
          </div>

          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <PredictionCard
                key={index}
                prediction={prediction as { amount: number; confidence: number; category: string; reasoning: string; historicalBasis: { averageAmount: number; frequency: number; lastAmount: number; trend: string; }; }}
                onAccept={() => console.log('Track prediction:', prediction)}
                onDismiss={() => setPredictions(prev => prev.filter((_, i) => i !== index))}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patterns.map((pattern, index) => (
              <AnimatedCard key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{String(pattern.categoryName)}</span>
                    <Badge variant={
                      pattern.trend === 'increasing' ? 'destructive' :
                      pattern.trend === 'decreasing' ? 'default' : 'secondary'
                    }>
                      {String(pattern.trend)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Average Amount</div>
                        <div className="font-semibold">{formatCurrency(Number(pattern.averageAmount))}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Frequency</div>
                        <div className="font-semibold">{Number(pattern.frequency).toFixed(1)}/month</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 text-sm mb-2">Spending Days</div>
                      <div className="flex gap-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              (pattern.dayOfWeek as number[]).includes(dayIndex)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Pattern Confidence</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Number(pattern.confidence) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{Math.round(Number(pattern.confidence) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedCard>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Advanced Analytics Coming Soon</h3>
            <p>Detailed spending analytics and trend visualizations will be available here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}