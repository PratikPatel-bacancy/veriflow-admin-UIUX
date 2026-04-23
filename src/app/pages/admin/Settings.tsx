import PageHeader from "../../components/common/PageHeader";
import { Bell, Lock, Globe, Database, Mail } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#3b82f6] bg-opacity-10 rounded-lg p-2">
              <Globe className="size-5 text-[#3b82f6]" />
            </div>
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                System Name
              </label>
              <input
                type="text"
                defaultValue="VeriFlow"
                className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                Time Zone
              </label>
              <select className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-6 (Central Time)</option>
                <option>UTC-7 (Mountain Time)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#10b981] bg-opacity-10 rounded-lg p-2">
              <Bell className="size-5 text-[#10b981]" />
            </div>
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#111827] dark:text-[#e8eef5]">Email Alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 border-[#e5e7eb] rounded text-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#111827] dark:text-[#e8eef5]">Violation Alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 border-[#e5e7eb] rounded text-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#111827] dark:text-[#e8eef5]">Device Alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 border-[#e5e7eb] rounded text-[#3b82f6]"
              />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#f59e0b] bg-opacity-10 rounded-lg p-2">
              <Lock className="size-5 text-[#f59e0b]" />
            </div>
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">Security</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#111827] dark:text-[#e8eef5]">
                Two-Factor Authentication
              </span>
              <input
                type="checkbox"
                className="size-4 border-[#e5e7eb] rounded text-[#3b82f6]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#111827] dark:text-[#e8eef5]">
                Session Timeout (30 min)
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="size-4 border-[#e5e7eb] rounded text-[#3b82f6]"
              />
            </label>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#8b5cf6] bg-opacity-10 rounded-lg p-2">
              <Mail className="size-5 text-[#8b5cf6]" />
            </div>
            <h3 className="font-semibold text-[#111827] dark:text-[#e8eef5]">Email Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                placeholder="smtp.example.com"
                className="w-full bg-[#eff6ff] border border-[#e5e7eb] rounded-lg px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-[#3b82f6] text-white font-medium rounded-lg px-6 py-2 hover:bg-[#2563eb] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
