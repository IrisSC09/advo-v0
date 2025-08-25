-- Insert sample bills
INSERT INTO public.bills (id, title, sponsor, party, topic, status, introduced_date, summary, key_points, committee, next_action) VALUES
('hr-2024-001', 'Climate Action and Green Jobs Act', 'Rep. Alexandria Ocasio-Cortez (D-NY)', 'Democrat', 'Climate', 'Committee Review', '2024-01-15', 
 'Comprehensive legislation to address climate change through job creation in renewable energy sectors and carbon reduction targets.',
 ARRAY['$500B investment in clean energy', '2 million new green jobs', '50% emissions reduction by 2030'],
 'House Committee on Energy and Commerce', 'Committee markup scheduled for January 25, 2024'),

('s-2024-045', 'Border Security Enhancement Act', 'Sen. Ted Cruz (R-TX)', 'Republican', 'Immigration', 'Floor Vote Pending', '2024-01-12',
 'Legislation to strengthen border security through increased funding for border patrol and enhanced screening technologies.',
 ARRAY['$25B for border wall completion', '5,000 new border agents', 'Mandatory E-Verify system'],
 'Senate Committee on Homeland Security', 'Floor vote scheduled for February 1, 2024'),

('hr-2024-078', 'Student Debt Relief and Education Reform Act', 'Rep. Bernie Sanders (I-VT)', 'Independent', 'Education', 'Introduced', '2024-01-10',
 'Comprehensive student debt forgiveness program coupled with free community college and trade school access.',
 ARRAY['$50K debt forgiveness per borrower', 'Free community college', 'Trade school funding'],
 'House Committee on Education and Labor', 'Committee review pending'),

('s-2024-023', 'Healthcare Price Transparency Act', 'Sen. Susan Collins (R-ME)', 'Republican', 'Healthcare', 'Committee Review', '2024-01-08',
 'Requires healthcare providers and insurers to disclose pricing information to improve market transparency.',
 ARRAY['Mandatory price disclosure', 'Insurance cost transparency', 'Patient billing rights'],
 'Senate Committee on Health, Education, Labor and Pensions', 'Committee hearing scheduled for January 30, 2024');
