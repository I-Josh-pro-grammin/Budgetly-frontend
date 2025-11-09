"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Printer, PieChart, Star } from "lucide-react"
import { ArrowLeft, Menu, User } from "lucide-react"
import { ThumbsUp } from "lucide-react"
import Image from "next/image"
import {
  TrendingUp,
  DollarSign,
  PieChartIcon as PieIcon,
  Target,
  MessageCircle,
  Send,
  ArrowRight,
  BarChart3,
  Wallet,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { 
  loginUser, 
  registerUser, 
  fetchUserProfile, 
  logoutUser 
} from "@/lib/slices/authSlice"

import {
   fetchTemplates as fetchBudgetTemplates
} from "@/lib/slices/templateSlice"
import { 
  fetchExpenses, 
  fetchExpenseStats 
} from "@/lib/slices/expenseSlice"
import { 
  fetchCategories 
} from "@/lib/slices/categorySlice"
import { 
  fetchTemplates 
} from "@/lib/slices/templateSlice"
import { 
  fetchChatSessions, 
  sendMessage 
} from "@/lib/slices/chatbotSlice"
import placeholder from "../public/placeholder.svg"

export default function BudgeTlyApp() {
  const dispatch = useAppDispatch()
  const { 
    user, 
    profile, 
    isAuthenticated, 
    isLoading: authLoading, 
    error: authError 
  } = useAppSelector(state => state.auth)
  // const { 
  //   budgets, 
  //   budgetTemplates: reduxBudgetTemplates, 
  //   isLoading: budgetLoading 
  // } = useAppSelector(state => state.budget)
  const { 
    expenses, 
    stats: expenseStats, 
    isLoading: expenseLoading 
  } = useAppSelector(state => state.expense)
  const { 
    categories, 
    isLoading: categoryLoading 
  } = useAppSelector(state => state.category)
  const { 
    templates, 
    isLoading: templateLoading 
  } = useAppSelector(state => state.template)
  const { 
    messages: chatMessages, 
    sessions: chatSessions, 
    isLoading: chatLoading 
  } = useAppSelector(state => state.chatbot)

  const [currentView, setCurrentView] = useState("landing")
  const [showPassword, setShowPassword] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    monthly_income: 0,
    currency: "USD"
  })

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserProfile())
      // dispatch(fetchBudgets())
      dispatch(fetchBudgetTemplates())
      dispatch(fetchExpenses())
      dispatch(fetchExpenseStats())
      dispatch(fetchCategories())
      dispatch(fetchTemplates())
      dispatch(fetchChatSessions())
    }
  }, [isAuthenticated, user, dispatch])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(loginForm))
    if (loginUser.fulfilled.match(result)) {
      setCurrentView("dashboard")
    }
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(registerUser(signupForm))
    if (registerUser.fulfilled.match(result)) {
      setCurrentView("login")
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logoutUser())
    setCurrentView("landing")
  }

  // Handle chat message
  const handleSendMessage = async () => {
    if (newMessage.trim() && chatSessions.length > 0) {
      const currentSession = chatSessions[0] // Use first session or create new one
      await dispatch(sendMessage({ 
        sessionId: currentSession.id, 
        message: newMessage 
      }))
      setNewMessage("")
    }
  }

  // Transform data for charts
  const expenseData = expenses.slice(0, 6).map(expense => ({
    month: new Date(expense.date).toLocaleDateString('en-US', { month: 'short' }),
    amount: expense.amount
  }))

  const budgetData = categories.slice(0, 4).map(category => ({
    name: category.name,
    value: category.budget_percentage,
    color: category.color
  }))

  const budgetTemplates = templates.slice(0, 4).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    image: "/placeholder.svg" // You can add image field to template model
  }))

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-bold text-foreground">BudgeTly</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("login")}>
              Login
            </Button>
            <Button size="sm" onClick={() => setCurrentView("signup")}>
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 text-center">
        <div className="max-w-sm mx-auto">
          <Badge variant="secondary" className="mb-4 text-xs">
            AI-Powered Budget Management
          </Badge>

          <h1 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BudgeTly
          </h1>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Struggling to save money right after your salary just dropped or tight budget? Let our AI model that
            recommends the best budgets for you.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            <Button size="lg" onClick={() => setCurrentView("signup")} className="w-full h-12 group">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setCurrentView("dashboard")} className="w-full h-12">
              View Demo
            </Button>
          </div>

          {/* Hero Chart */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-4">
            <div className="bg-background rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-semibold text-sm">Monthly Overview</h3>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={expenseData.slice(0, 4)}>
                    <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} dot={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Templates Section */}
      <section className="px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-serif font-bold mb-2">Get to explore different budgets</h2>
          <p className="text-sm text-muted-foreground">
            With an integrated AI model that recommends the best budgets for you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {budgetTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-3">
                <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif font-semibold text-xs mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground leading-tight">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6">
        <div className="px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
              <Wallet className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-sm">BudgeTly</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Contact us:</p>
          <p className="text-xs text-muted-foreground">support@budgetly.com</p>
          <p className="text-xs text-muted-foreground">+1234567890</p>
        </div>
      </footer>
    </div>
  )

  const AuthForm = ({ type }: { type: "login" | "signup" }) => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-serif">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {type === "login" 
              ? "Sign in to your BudgeTly account" 
              : "Start your budgeting journey today"
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={type === "login" ? handleLogin : handleSignup} className="space-y-4">
            {type === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={signupForm.first_name}
                      onChange={(e) => setSignupForm({...signupForm, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={signupForm.last_name}
                      onChange={(e) => setSignupForm({...signupForm, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="monthly_income">Monthly Income</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    value={signupForm.monthly_income}
                    onChange={(e) => setSignupForm({...signupForm, monthly_income: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={signupForm.currency}
                    onChange={(e) => setSignupForm({...signupForm, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={type === "login" ? loginForm.username : signupForm.username}
                onChange={(e) => type === "login" 
                  ? setLoginForm({...loginForm, username: e.target.value})
                  : setSignupForm({...signupForm, username: e.target.value})
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={type === "login" ? loginForm.password : signupForm.password}
                  onChange={(e) => type === "login"
                    ? setLoginForm({...loginForm, password: e.target.value})
                    : setSignupForm({...signupForm, password: e.target.value})
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            {authError && (
              <div className="text-red-500 text-sm text-center">{authError}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? "Loading..." : type === "login" ? "Sign In" : "Create Account"}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView(type === "login" ? "signup" : "login")}
              >
                {type === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </form>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setCurrentView("landing")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const Dashboard = () => {
    if (!isAuthenticated) {
      setCurrentView("login")
      return null
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-serif font-bold text-foreground">BudgeTly</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("chat")}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("budget")}>
                <Plus className="w-4 h-4 mr-2" />
                New Budget
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar|| placeholder} />
                <AvatarFallback>{user?.first_name?.[0] || user?.username?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 space-y-6">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for this month
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-xl font-bold">${user?.monthly_income || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <PieIcon className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-xl font-bold">
                      ${expenseStats?.monthly_expenses || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Savings Goal</p>
                    <p className="text-xl font-bold">
                      ${300} {/* Placeholder for savings goal */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Expense Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieIcon className="w-5 h-5" />
                  <span>Budget Allocation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {categories.find(c => c.id === expense.category)?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${expense.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const ChatInterface = () => {
    if (!isAuthenticated) {
      setCurrentView("login")
      return null
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-serif font-bold">AI Assistant</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user_message ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user_message
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">
                  {message.user_message || message.bot_response}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t bg-background p-4">
          <div className="max-w-2xl mx-auto flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={chatLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const BudgetEnroll = () => {
    if (!isAuthenticated) {
      setCurrentView("login")
      return null
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-serif font-bold">Budget Templates</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Budget Templates */}
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Choose Your Budget Template</h2>
              <p className="text-muted-foreground">
                Select a template that fits your lifestyle and financial goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <img
                        src={template.image || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-serif font-semibold text-lg mb-2">{template.name}</h3>
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                    <Button className="w-full">
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans">
      {currentView === "landing" && <LandingPage />}
      {currentView === "login" && <AuthForm type="login" />}
      {currentView === "signup" && <AuthForm type="signup" />}
      {currentView === "dashboard" && <Dashboard />}
      {currentView === "chat" && <ChatInterface />}
      {currentView === "budget" && <BudgetEnroll />}
    </div>
  )
}
