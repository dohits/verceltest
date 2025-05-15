"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {UIConfig} from "@/components/mixui/UIConfig"
const navigation = [
  { name: "홈", href: "/" },
  { name: "테스트", href: "/test" },
]

export default function HeaderComponent() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b-1 items-center flex justify-center",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-background",
      )}
      style={{ height: UIConfig.HeaderHeight }}
    >
      <div className="flex w-full h-16 items-center justify-between pl-4 pr-4">
        <div className="flex items-center">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <span className="font-bold text-xl">브랜드</span>
          </Link>
          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 데스크톱 액션 버튼 */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            로그인
          </Button>
          <Button size="sm">회원가입</Button>
        </div>

        {/* 모바일 메뉴 */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="px-4 py-6">
                {/* Radix 접근성 컴포넌트 추가 */}
                <VisuallyHidden>
                  <DialogTitle>모바일 메뉴</DialogTitle>
                </VisuallyHidden>
                <Link href="/" className="flex items-center mb-6">
                  <span className="font-bold text-xl">브랜드</span>
                </Link>
                <nav className="flex flex-col space-y-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-auto px-4 py-6 border-t">
                <div className="grid gap-4">
                  <Button variant="outline" className="w-full">
                    로그인
                  </Button>
                  <Button className="w-full">회원가입</Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
