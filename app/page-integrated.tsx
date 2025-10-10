"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, TrendingUp, DollarSign, PieChartIcon as PieIcon, Target, MessageCircle, Send, ArrowRight, Plus, Eye, EyeOff, ArrowLeft, LogOut } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from "recharts"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser, registerUser, fetchUserProfile, logoutUser } from "@/lib/slices/authSlice"
import { fetchBudgets, fetchBudgetTemplates } from "@/lib/slices/budgetSlice"
import { fetchExpenses, fetchExpenseStats } from "@/lib/slices/expenseSlice"
import { fetchCategories } from "@/lib/slices/categorySlice"
import { fetchTemplates } from "@/lib/slices/templateSlice"
import { fetchChatSessions, sendMessage } from "@/lib/slices/chatbotSlice"

export default function BudgeTlyApp() {
  const dispatch = useAppDispatch()
  const { user, profile, isAuthenticated, isLoading: authLoading, error: authError } = useAppSelector(state => state.auth)
  const { budgets, budgetTemplates: reduxBudgetTemplates, isLoading: budgetLoading } = useAppSelector(state => state.budget)
  const { expenses, stats: expenseStats, isLoading: expenseLoading } = useAppSelector(state => state.expense)
  const { categories, isLoading: categoryLoading } = useAppSelector(state => state.category)
  const { templates, isLoading: templateLoading } = useAppSelector(state => state.template)
  const { messages: chatMessages, sessions: chatSessions, isLoading: chatLoading } = useAppSelector(state => state.chatbot)

  const [currentView, setCurrentView] = useState("landing")
  const [showPassword, setShowPassword] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [signupForm, setSignupForm] = useState({
    username: "", email: "", password: "", first_name: "", last_name: "", monthly_income: 0, currency: "USD"
  })

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserProfile())
      dispatch(fetchBudgets())
      dispatch(fetchBudgetTemplates())
      dispatch(fetchExpenses())
      dispatch(fetchExpenseStats())
      dispatch(fetchCategories())
      dispatch(fetchTemplates())
      dispatch(fetchChatSessions())
    }
  }, [isAuthenticated, user, dispatch])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(loginForm))
    if (loginUser.fulfilled.match(result)) {
      setCurrentView("dashboard")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(registerUser(signupForm))
    if (registerUser.fulfilled.match(result)) {
      setCurrentView("login")
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setCurrentView("landing")
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatSessions.length > 0) {
      const currentSession = chatSessions[0]
      await dispatch(sendMessage({ sessionId: currentSession.id, message: newMessage }))
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
    image: "/placeholder.svg"
  }))

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-serif font-bold text-foreground">BudgeTly</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("login")}>Login</Button>
            <Button size="sm" onClick={() => setCurrentView("signup")}>Sign up</Button>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 text-center">
        <div className="max-w-sm mx-auto">
          <Badge variant="secondary" className="mb-4 text-xs">AI-Powered Budget Management</Badge>
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
        </div>
      </section>
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
                <AvatarImage src={profile?.avatar} />
                <AvatarFallback>{user?.first_name?.[0] || user?.username?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-muted-foreground">Here's your financial overview for this month</p>
          </div>

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
                    <p className="text-xl font-bold">${expenseStats?.monthly_expenses || 0}</p>
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
                    <p className="text-xl font-bold">${profile?.savings_goal || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
    </div>
  )
}

