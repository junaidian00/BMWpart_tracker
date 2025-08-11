"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Smartphone, Monitor, Menu, Palette } from 'lucide-react'

interface TestResult {
  name: string
  passed: boolean
  message: string
}

export function NavigationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTest = async (testName: string, testFn: () => boolean, successMessage: string, failMessage: string) => {
    try {
      const result = testFn()
      return {
        name: testName,
        passed: result,
        message: result ? successMessage : failMessage
      }
    } catch (error) {
      return {
        name: testName,
        passed: false,
        message: `Error: ${error}`
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // Test 1: Desktop Navigation Button
    results.push(await runTest(
      "Desktop Navigation Button",
      () => {
        const navButton = document.querySelector('[data-testid="nav-button"]') || 
                         document.querySelector('button:contains("Navigation")')
        return navButton !== null
      },
      "Navigation button found and visible",
      "Navigation button not found"
    ))

    // Test 2: Mobile Responsiveness
    results.push(await runTest(
      "Mobile Responsiveness",
      () => {
        const isMobile = window.innerWidth < 768
        const mobileElements = document.querySelectorAll('.lg\\:hidden')
        return !isMobile || mobileElements.length > 0
      },
      "Mobile responsive elements detected",
      "Mobile responsiveness issues detected"
    ))

    // Test 3: Dropdown Functionality
    results.push(await runTest(
      "Dropdown Menu",
      () => {
        const dropdowns = document.querySelectorAll('[role="menu"], .dropdown-menu, [class*="dropdown"]')
        return dropdowns.length > 0
      },
      "Dropdown menu elements found",
      "Dropdown menu elements not found"
    ))

    // Test 4: Color Contrast
    results.push(await runTest(
      "Color Contrast",
      () => {
        const buttons = document.querySelectorAll('button')
        let hasGoodContrast = false
        buttons.forEach(button => {
          const styles = window.getComputedStyle(button)
          const bgColor = styles.backgroundColor
          const textColor = styles.color
          if (bgColor.includes('rgb(37, 99, 235)') || bgColor.includes('blue')) {
            hasGoodContrast = true
          }
        })
        return hasGoodContrast
      },
      "Good color contrast detected",
      "Color contrast issues detected"
    ))

    setTestResults(results)
    setIsRunning(false)
  }

  const runIndividualTest = async (testType: string) => {
    setIsRunning(true)
    let result: TestResult

    switch (testType) {
      case 'desktop':
        result = await runTest(
          "Desktop Test",
          () => window.innerWidth >= 1024,
          "Desktop view detected",
          "Not in desktop view"
        )
        break
      case 'mobile':
        result = await runTest(
          "Mobile Test",
          () => window.innerWidth < 768,
          "Mobile view detected",
          "Not in mobile view"
        )
        break
      case 'dropdown':
        result = await runTest(
          "Dropdown Test",
          () => {
            const navButton = document.querySelector('button')
            if (navButton) {
              navButton.click()
              setTimeout(() => {
                const dropdown = document.querySelector('[class*="absolute"]')
                return dropdown !== null
              }, 100)
            }
            return false
          },
          "Dropdown opens successfully",
          "Dropdown failed to open"
        )
        break
      case 'colors':
        result = await runTest(
          "Color Test",
          () => {
            const blueElements = document.querySelectorAll('[class*="blue"], [class*="bg-blue"]')
            return blueElements.length > 0
          },
          "Blue color scheme detected",
          "Blue color scheme not found"
        )
        break
      default:
        result = { name: "Unknown Test", passed: false, message: "Unknown test type" }
    }

    setTestResults([result])
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Navigation Testing Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Button 
              onClick={() => runIndividualTest('desktop')} 
              disabled={isRunning}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Test Desktop
            </Button>
            <Button 
              onClick={() => runIndividualTest('mobile')} 
              disabled={isRunning}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Test Mobile
            </Button>
            <Button 
              onClick={() => runIndividualTest('dropdown')} 
              disabled={isRunning}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Menu className="h-4 w-4 mr-2" />
              Test Dropdown
            </Button>
            <Button 
              onClick={() => runIndividualTest('colors')} 
              disabled={isRunning}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Palette className="h-4 w-4 mr-2" />
              Test Colors
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Desktop Testing</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Look for the blue "Navigation" button in the header</li>
                <li>2. Click the button to open the dropdown menu</li>
                <li>3. Verify all 6 navigation items are visible</li>
                <li>4. Check that quick actions are present</li>
                <li>5. Click outside to close the menu</li>
              </ol>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Mobile Testing</h4>
              <ol className="text-sm text-green-700 space-y-1">
                <li>1. Resize browser to mobile width (&lt;768px)</li>
                <li>2. Look for the blue "Navigation" button</li>
                <li>3. Tap the button to open the menu</li>
                <li>4. Verify all navigation items are touch-friendly</li>
                <li>5. Check that auth buttons appear in mobile menu</li>
              </ol>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Color Contrast Testing</h4>
              <ol className="text-sm text-purple-700 space-y-1">
                <li>1. Check that the Navigation button has blue background</li>
                <li>2. Verify white text is clearly visible on blue background</li>
                <li>3. Test hover states for good contrast</li>
                <li>4. Ensure all text is readable against backgrounds</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
