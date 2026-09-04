"use client";

import React, { useEffect, useState } from 'react';
import { adminClient } from '@/lib/api/adminClient';

interface Branch { id: string; name: string; code: string; }
interface AcademicYear { id: string; label: string; value: number; }
interface Semester { id: string; academic_year_id: string; label: string; value: number; }
interface Subject { id: string; branch_id: string; semester_id: string; name: string; code: string; }

export interface AcademicSelection {
  branch_id: string;
  academic_year_id: string;
  semester_id: string;
  subject_id: string;
}

interface AcademicSelectorProps {
  value: AcademicSelection;
  onChange: (value: AcademicSelection) => void;
  disabled?: boolean;
}

export function AcademicSelector({ value, onChange, disabled }: AcademicSelectorProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitial() {
      try {
        const [bRes, yRes, sRes] = await Promise.all([
          adminClient.getAcademicEntity('branches'),
          adminClient.getAcademicEntity('academic_years'),
          adminClient.getAcademicEntity('semesters')
        ]);
        setBranches(bRes.branches || []);
        setYears(yRes.academic_years || []);
        setSemesters(sRes.semesters || []);
      } catch (err) {
        console.error('Failed to load academic data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, []);

  useEffect(() => {
    async function loadSubjects() {
      if (value.branch_id && value.semester_id) {
        try {
          // getSubjects supports filtering by branch_id and semester (actually semester_id based on API)
          const res = await adminClient.getSubjects({ branch_id: value.branch_id, semester: value.semester_id });
          setSubjects(res.subjects || []);
        } catch (err) {
          console.error('Failed to load subjects', err);
        }
      } else {
        setSubjects([]);
      }
    }
    loadSubjects();
  }, [value.branch_id, value.semester_id]);

  const availableSemesters = semesters.filter(s => s.academic_year_id === value.academic_year_id);

  const handleChange = (field: keyof AcademicSelection, newValue: string) => {
    let nextValue = { ...value, [field]: newValue };

    if (field === 'branch_id') {
      nextValue.subject_id = '';
    } else if (field === 'academic_year_id') {
      nextValue.semester_id = '';
      nextValue.subject_id = '';
    } else if (field === 'semester_id') {
      nextValue.subject_id = '';
    }

    onChange(nextValue);
  };

  if (loading) return <div className="text-sm text-gray-500">Loading academic data...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
        <select
          value={value.branch_id}
          onChange={(e) => handleChange('branch_id', e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select Branch</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
        <select
          value={value.academic_year_id}
          onChange={(e) => handleChange('academic_year_id', e.target.value)}
          disabled={disabled || !value.branch_id}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select Year</option>
          {years.map(y => (
            <option key={y.id} value={y.id}>{y.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
        <select
          value={value.semester_id}
          onChange={(e) => handleChange('semester_id', e.target.value)}
          disabled={disabled || !value.academic_year_id}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select Semester</option>
          {availableSemesters.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <select
          value={value.subject_id}
          onChange={(e) => handleChange('subject_id', e.target.value)}
          disabled={disabled || !value.semester_id || !value.branch_id}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
          ))}
        </select>
      </div>
    </div>
  );
}
