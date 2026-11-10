import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext.tsx';
import { PhoneCall, MapPin, Mail, Clock, MessageSquare, Plus, Trash2 } from 'lucide-react';

export const ContactTab: React.FC = () => {
  const { contact, updateContact } = useBuilder();

  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchAddress.trim()) return;

    updateContact({
      branchLocations: [
        ...contact.branchLocations,
        {
          name: newBranchName.trim(),
          address: newBranchAddress.trim(),
          phone: newBranchPhone.trim() || contact.phone
        }
      ]
    });

    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
  };

  const handleRemoveBranch = (idx: number) => {
    updateContact({
      branchLocations: contact.branchLocations.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-blue-400" />
          <span>Contact Channels &amp; Branch Locations</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage corporate telephone numbers, WhatsApp advisory, physical headquarters, and global branch networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Direct Channels */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Primary Client Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Direct Desk Telephone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={e => updateContact({ phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Toll-Free Number</label>
              <input
                type="text"
                value={contact.tollFree}
                onChange={e => updateContact({ tollFree: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Support &amp; Advisory Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={e => updateContact({ email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">WhatsApp Advisory Direct</label>
              <input
                type="text"
                value={contact.whatsappNumber}
                onChange={e => updateContact({ whatsappNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Operating &amp; Underwriting Hours</label>
            <input
              type="text"
              value={contact.operatingHours}
              onChange={e => updateContact({ operatingHours: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Global Headquarters Address</label>
            <textarea
              rows={2}
              value={contact.address}
              onChange={e => updateContact({ address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Google Maps Embed URL</label>
            <input
              type="text"
              value={contact.googleMapsEmbedUrl}
              onChange={e => updateContact({ googleMapsEmbedUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Regional Branch Offices */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Corporate &amp; Regional Branch Offices ({contact.branchLocations.length})
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {contact.branchLocations.map((branch, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">{branch.name}</span>
                    <span className="text-slate-400 block mt-0.5">{branch.address}</span>
                    <span className="text-blue-400 font-mono text-[11px] block mt-0.5">{branch.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Branch */}
          <form onSubmit={handleAddBranch} className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">Add New Branch Location</span>
            <input
              type="text"
              value={newBranchName}
              onChange={e => setNewBranchName(e.target.value)}
              placeholder="Branch Name (e.g. Frankfurt Financial Hub)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={newBranchAddress}
              onChange={e => setNewBranchAddress(e.target.value)}
              placeholder="Full Address & City"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newBranchPhone}
                onChange={e => setNewBranchPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Branch</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
