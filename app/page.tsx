"use client"

import { useState } from "react"
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

const expenseData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 9800 },
  { month: "Apr", amount: 3908 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 3800 },
]

const budgetData = [
  { name: "Food", value: 400, color: "#d97706" },
  { name: "Transport", value: 300, color: "#f97316" },
  { name: "Entertainment", value: 200, color: "#be123c" },
  { name: "Utilities", value: 150, color: "#4b5563" },
]

const budgetTemplates = [
  { id: 1, name: "Student Budget", description: "Perfect for college students", image: "/student-budget-template.png" },
  { id: 2, name: "Family Budget", description: "Ideal for family expenses", image: "/family-budget-template.png" },
  { id: 3, name: "Travel Budget", description: "Plan your next adventure", image: "/travel-budget-template.png" },
  { id: 4, name: "Emergency Fund", description: "Build your safety net", image: "/emergency-fund-template.png" },
]

export default function BudgeTlyApp() {
  const [currentView, setCurrentView] = useState("landing")
  const [showPassword, setShowPassword] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi! I'm your BudgeTly assistant. How can I help you manage your budget today?", sender: "bot" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { id: chatMessages.length + 1, text: newMessage, sender: "user" },
        {
          id: chatMessages.length + 2,
          text: "Thanks for your message! I'm here to help you with budgeting tips and expense tracking.",
          sender: "bot",
        },
      ])
      setNewMessage("")
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-serif font-bold">BudgeTly</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-primary">{type === "login" ? "Log in" : "Sign up"}</h1>
      </div>

      {/* Form */}
      <div className="flex-1 px-4">
        <Card className="shadow-lg max-w-sm mx-auto">
          <CardContent className="p-6 space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">
                  Username
                </Label>
                <Input id="username" placeholder="Enter your username" className="h-12" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Enter your email" className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button className="w-full h-12 text-base" onClick={() => setCurrentView("dashboard")}>
              {type === "login" ? "Log in" : "Sign up"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 bg-transparent">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {type === "login" ? "Log in with Google" : "Sign up with Google"}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">
                {type === "login" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-primary"
                onClick={() => setCurrentView(type === "login" ? "signup" : "login")}
              >
                {type === "login" ? "Sign up" : "Log in"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 pb-8">
          <Button variant="link" onClick={() => setCurrentView("landing")}>
            ← Back to home
          </Button>
        </div>
      </div>
    </div>
  )

  const Dashboard = () => {return (
    <div className="min-h-screen bg-[#f0f2f9] pb-8">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-[#3bd517]">Budget</span>
            <span className="text-[#313131]">TLY</span>
          </h1>
          <p className="text-sm text-[#718096]">Smart Budget Organizer</p>
        </div>
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#313131]" />
          <Printer className="w-6 h-6 text-[#313131]" />
        </div>
      </header>

      <div className="px-4 space-y-6">
        {/* Budget Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Card className="bg-white/80 border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-[#3bd517] text-lg mb-1">$</div>
              <div className="font-semibold text-[#313131] mb-1">Budget</div>
              <div className="text-lg font-bold text-[#313131]">$5,240</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-[#3bd517] text-lg mb-1">$</div>
              <div className="font-semibold text-[#313131] mb-1">Spent</div>
              <div className="text-lg font-bold text-[#313131]">$3,180</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-[#3bd517] text-lg mb-1">$</div>
              <div className="font-semibold text-[#313131] mb-1">Left</div>
              <div className="text-lg font-bold text-[#313131]">$2,060</div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Overview Chart */}
        <Card className="bg-white/80 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#313131]" />
              <h2 className="text-lg font-semibold text-[#313131]">Expenses overview</h2>
            </div>

            <div className="relative h-64">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e7e7e7" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Y-axis labels */}
                <text x="10" y="20" className="text-xs fill-[#718096]">
                  2000$
                </text>
                <text x="10" y="60" className="text-xs fill-[#718096]">
                  1000$
                </text>
                <text x="10" y="100" className="text-xs fill-[#718096]">
                  500$
                </text>
                <text x="10" y="140" className="text-xs fill-[#718096]">
                  100$
                </text>
                <text x="10" y="180" className="text-xs fill-[#718096]">
                  10$
                </text>

                <path
                  d="M 50 180 Q 70 120 90 60 Q 110 50 130 55 Q 150 60 170 65 Q 190 70 210 90 Q 230 110 250 130 Q 270 140 290 145"
                  stroke="#3bd517"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Data points */}
                <circle cx="50" cy="180" r="3" fill="#3bd517" />
                <circle cx="90" cy="60" r="3" fill="#3bd517" />
                <circle cx="130" cy="55" r="3" fill="#3bd517" />
                <circle cx="170" cy="65" r="3" fill="#3bd517" />
                <circle cx="210" cy="90" r="3" fill="#3bd517" />
                <circle cx="250" cy="130" r="3" fill="#3bd517" />
                <circle cx="290" cy="145" r="3" fill="#3bd517" />

                {/* X-axis labels */}
                <text x="45" y="195" className="text-xs fill-[#718096]">
                  1
                </text>
                <text x="85" y="195" className="text-xs fill-[#718096]">
                  2
                </text>
                <text x="125" y="195" className="text-xs fill-[#718096]">
                  3
                </text>
                <text x="165" y="195" className="text-xs fill-[#718096]">
                  4
                </text>
                <text x="205" y="195" className="text-xs fill-[#718096]">
                  5
                </text>
                <text x="245" y="195" className="text-xs fill-[#718096]">
                  6
                </text>
                <text x="285" y="195" className="text-xs fill-[#718096]">
                  7
                </text>
              </svg>

              <div className="absolute bottom-0 left-8 text-sm font-medium text-[#313131]">Months</div>
              <div className="absolute left-0 top-1/2 -rotate-90 text-sm font-medium text-[#313131] origin-center">
                Expenses
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card className="bg-white/80 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-[#313131]" />
              <h2 className="text-lg font-semibold text-[#313131]">Budget breakdown</h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-6">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Feed - $400 (largest segment) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill="none"
                    stroke="#eded17"
                    strokeWidth="20"
                    strokeDasharray="47.1 157"
                    strokeDashoffset="0"
                  />
                  {/* Transport - $300 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill="none"
                    stroke="#1d90aa"
                    strokeWidth="20"
                    strokeDasharray="35.3 157"
                    strokeDashoffset="-47.1"
                  />
                  {/* Entertainment - $200 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill="none"
                    stroke="#7d0a7b"
                    strokeWidth="20"
                    strokeDasharray="23.6 157"
                    strokeDashoffset="-82.4"
                  />
                  {/* Utilities - $150 */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill="none"
                    stroke="#12bf97"
                    strokeWidth="20"
                    strokeDasharray="17.7 157"
                    strokeDashoffset="-106"
                  />
                  {/* Remaining segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r="30"
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth="20"
                    strokeDasharray="33.3 157"
                    strokeDashoffset="-123.7"
                  />
                  {/* Inner white circle */}
                  <circle cx="60" cy="60" r="20" fill="white" />
                </svg>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#eded17]"></div>
                  <span className="text-[#313131]">Feed</span>
                  <span className="text-[#313131] ml-auto">$400</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1d90aa]"></div>
                  <span className="text-[#313131]">Transport</span>
                  <span className="text-[#313131] ml-auto">$300</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7d0a7b]"></div>
                  <span className="text-[#313131]">Entertainment</span>
                  <span className="text-[#313131] ml-auto">$200</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#12bf97]"></div>
                  <span className="text-[#313131]">Utilities</span>
                  <span className="text-[#313131] ml-auto">$150</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Budgets */}
        <div>
          <h2 className="text-lg font-semibold text-[#313131] mb-4">Suggested budgets</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-[#e7e7e7] relative">
                <img
                  src="/budget-spreadsheet-laptop.png"
                  alt="Budget template"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <Button className="bg-[#0d710d] hover:bg-[#098709] text-white text-xs px-3 py-1 h-auto" onClick={() => setCurrentView('budget')}>
                    Enroll now
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#eded17] text-[#eded17]" />
                    <span className="text-xs text-[#313131]">4.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-[#e7e7e7] relative">
                <img
                  src="/budget-spreadsheet-laptop.png"
                  alt="Budget template"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <Button className="bg-[#0d710d] hover:bg-[#098709] text-white text-xs px-3 py-1 h-auto" onClick={() => setCurrentView('budget')}>
                    Enroll now
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#eded17] text-[#eded17]" />
                    <span className="text-xs text-[#313131]">4.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 space-y-2">
          <div className="text-2xl font-bold">
            <span className="text-[#3bd517]">Budget</span>
            <span className="text-[#313131]">TLY</span>
          </div>
          <div className="text-sm text-[#313131] space-y-1">
            <p className="font-semibold">Contact us:</p>
            <p>Email: badgetly@gmail.com</p>
            <p>Phone: +250788554433</p>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6" onClick={() => setCurrentView("chat")}>
        <Button className="w-12 h-12 rounded-full bg-[#0d710d] hover:bg-[#098709] text-white shadow-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </Button>
      </div>
    </div>
  )
  }


  const ChatInterface =() => {
  return (
    <div className="min-h-screen bg-[#f0f2f9] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#f0f2f9]">
        <Button variant="ghost" size="sm" className="p-2" onClick={() => setCurrentView("dashboard")}>
          <ArrowLeft className="h-6 w-6 text-[#000000]" />
        </Button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold text-[#000000]">Budge</span>
            <span className="text-xl font-semibold text-[#4fd1c5]">TLY</span>
          </div>
          <span className="text-xs text-[#718096]">Smart Budget Generator</span>
        </div>

        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-6 w-6 text-[#000000]" />
        </Button>
      </header>

      {/* Chat Title */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-semibold">
          <span className="text-[#098709]">Budget</span>
          <span className="text-[#000000]">Tly chatbot</span>
        </h1>
      </div>

      {/* Chat Container */}
      <div className="flex-1 mx-4 mb-4">
        <div className="bg-[#ffffff] rounded-3xl p-6 h-full shadow-lg flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* User Message - Hello! */}
            <div className="flex justify-end items-start gap-3">
              <div className="bg-[#d9d9d9] rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-[#000000] text-sm">Hello!</p>
              </div>
              <div className="w-8 h-8 bg-[#cccccc] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[#000000]" />
              </div>
            </div>

            {/* Bot Message - Greeting */}
            <div className="flex justify-start">
              <div className="bg-[#cccccc] rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-[#000000] text-sm">Hello there! How can i help you today?</p>
              </div>
            </div>

            {/* User Message - Question */}
            <div className="flex justify-end items-start gap-3">
              <div className="bg-[#d9d9d9] rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-[#000000] text-sm">Can poor budget planning cause poverty?</p>
              </div>
              <div className="w-8 h-8 bg-[#cccccc] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[#000000]" />
              </div>
            </div>

            {/* Bot Message - Long Response */}
            <div className="flex justify-start">
              <div className="bg-[#cccccc] rounded-2xl px-4 py-3 max-w-sm">
                <p className="text-[#000000] text-sm">
                  Yes, poor budget planning can contribute to poverty in the following ways:Chronic overspending,Debt
                  accumulation, No safety net and many more...
                </p>
              </div>
            </div>

            {/* User Message - Thanks */}
            <div className="flex justify-end items-start gap-3">
              <div className="bg-[#d9d9d9] rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-[#000000] text-sm">Thanks am now gonna become millionaire!</p>
              </div>
              <div className="w-8 h-8 bg-[#cccccc] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[#000000]" />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Tell me what you want ?"
                className="bg-[#f0f2f9] border-none rounded-2xl px-4 py-3 text-[#000000] placeholder:text-[#718096]"
              />
            </div>
            <Button size="sm" className="bg-[#098709] hover:bg-[#087608] rounded-2xl p-3 h-auto">
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
const BudgetEnroll = () => {
  return (
    <div className="min-h-screen bg-[#f0f2f9] px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <ArrowLeft className="w-6 h-6 text-[#000000]" />
          <span className="text-[#000000] text-lg font-medium">Back</span>
        </div>

        <div className="flex items-center">
          <span className="text-[#4fd1c5] text-xl font-bold">Budget</span>
          <span className="text-[#0d710d] text-xl font-bold">TLY</span>
          <div className="text-xs text-[#718096] ml-1">Smart Budget Generator</div>
        </div>

        <Menu className="w-6 h-6 text-[#000000]" />
      </div>

      {/* Main Card */}
      <div className="bg-[#ffffff] rounded-3xl p-6 shadow-lg max-w-sm mx-auto">
        {/* Laptop Image */}
        <div className="mb-6">
          <Image
            src="/budget-spreadsheet-laptop.png"
            alt="Budget spreadsheet on laptop"
            width={300}
            height={200}
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>

        {/* Rating and Comments Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-[#000000] text-lg font-semibold">4.5</span>
            <Star className="w-6 h-6 text-[#cccccc]" />
          </div>
          <span className="text-[#0d710d] text-lg font-medium">comments</span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <button className="bg-[#0d710d] text-[#ffffff] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#098709] transition-colors" onClick={() => setCurrentView('budget')}>
            Enroll now
          </button>
          <ThumbsUp className="w-8 h-8 text-[#000000]" />
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
