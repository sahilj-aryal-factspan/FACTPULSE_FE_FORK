import { lazy } from 'react';

// Landing & Login
export const LandingPage = lazy(() => import('../pages/landing'));
export const LoginPage = lazy(() => import('../pages/login'));

// Admin / User Management
export const UserManagementPage = lazy(() => import('../pages/admin/users'));

// Portfolio
export const PortfolioPage = lazy(() => import('../pages/portfolio'));
export const AccountsDirectoryPage = lazy(() => import('../pages/accounts/directory'));

// Account
export const AccountDashboardPage = lazy(() => import('../pages/accounts/dashboard'));
export const AccountFormPage = lazy(() => import('../pages/accounts/form'));

// Buying Center
export const BuyingCenterDashboardPage = lazy(() => import('../pages/buying-centers/dashboard'));
export const StakeholderManagementPage = lazy(() => import('../pages/buying-centers/stakeholders'));

// Project
export const ProjectsListPage = lazy(() => import('../pages/projects/list'));
export const ProjectDashboardPage = lazy(() => import('../pages/projects/dashboard'));
export const ProjectFormPage = lazy(() => import('../pages/projects/form'));

// Governance
export const GovernanceCenterPage = lazy(() => import('../pages/governance'));
export const GovernanceExceptionsPage = lazy(() => import('../pages/governance/exceptions'));

// AI Workspace
export const ArtifactUploadPage = lazy(() => import('../pages/ai-workspace/upload'));
export const AIProcessingPage = lazy(() => import('../pages/ai-workspace/processing'));
export const AIWorkspacePage = lazy(() => import('../pages/ai-workspace'));

// FactsAi
export const FactsAiPage = lazy(() => import('../pages/facts-ai'));
