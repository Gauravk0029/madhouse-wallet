'use client'
import React, { useState } from 'react'
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import Switch from 'react-switch'
import user from '@/public/user.png'
import { useTheme } from '@/components/ContextApi/ThemeContext'
import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const router = useRouter()

  // Get the current page name from the router's pathname

  const handleConfirmation = () => setConfirmation(!confirmation)

  const isChecked: boolean = theme === 'light'

  return (
    <>
      <header
        className="siteHeader sticky-top py-1 w-100 shadow"
        style={{ zIndex: 99, background: 'var(--backgroundColor)' }}
      >
        <Container>
          <Navbar expand="lg">
            <Navbar.Brand
              className="fw-bold"
              href="#"
              style={{ fontSize: 20, color: 'var(--textColor)' }}
            >
              Madhouse Wallet
            </Navbar.Brand>

            <Navbar.Toggle
              className="border-0 p-0"
              aria-controls="navbarScroll"
            />
            <Navbar.Collapse
              className="justify-content-end w-100"
              id="navbarScroll"
            >
              <Nav className="my-2 my-lg-0 align-items-center justify-content-end w-100 gap-10 flex-wrap">
                <div className="right d-flex align-items-center gap-10 flex-wrap">
                  <Tooltip
                    id="theme"
                    style={{ backgroundColor: '#76fc93', color: '#000' }}
                  />
                  <div
                    data-tooltip-id="theme"
                    data-tooltip-content={
                      !isChecked ? 'Dark Theme' : 'Light Theme'
                    }
                  >
                    <GradientHandleSwitch
                      uncheckedIcon={undefined}
                      checkedIcon={undefined}
                      height={16}
                      width={48}
                      handleDiameter={24}
                      offColor="#4C4C57"
                      onColor="#4C4C57"
                      checked={isChecked}
                      onChange={toggleTheme}
                      boxShadow="0px 0px 0px 0px"
                      activeBoxShadow="0px 0px 0px 0px"
                    />
                  </div>
                  <Button className="d-flex align-items-center justify-content-center commonBtn">
                    Gnosis Safe Address: 32345234sdfsd23423
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle
                      className="p-0 border-0 d-flex align-items-center"
                      variant="transparent"
                      id="dropdown-basic"
                    >
                      <Image
                        src={user}
                        alt=""
                        style={{ height: 40, width: 40 }}
                        className="img-fluid object-fit-cover rounded-circle"
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <ul className="list-unstyled ps-0 mb-0">
                        <li className="py-1">
                          <Link
                            href="/setting"
                            className="px-3 py-1 d-flex align-items-center gap-10 text-dark fw-sbold"
                          >
                            Setting
                          </Link>
                        </li>
                        <li className="py-1">
                          <Link
                            href="/login"
                            className="px-3 py-1 d-flex align-items-center gap-10 text-dark fw-sbold"
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </header>
    </>
  )
}

const GradientHandleSwitch = styled(Switch)`
  .react-switch-handle {
    background: linear-gradient(180deg, #76fc93 0%, #1f854f 100%) !important;
  }
`

export default Header
