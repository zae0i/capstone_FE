import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { Merchant, Category, EsgRule } from '@/types';

const Admin = () => {
  const queryClient = useQueryClient();

  // --- Merchant Management ---
  const { data: merchants, isLoading: isLoadingMerchants } = useQuery<Merchant[], Error>({
    queryKey: ['merchants'],
    queryFn: async () => {
      const response = await api.get<Merchant[]>('/admin/merchant');
      return response.data;
    },
  });

  const { mutate: addMerchant } = useMutation<Merchant, Error, { name: string }>({
    mutationFn: async (newMerchant) => {
      const response = await api.post<Merchant>('/admin/merchant', newMerchant);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      alert('가맹점 추가 성공!');
    },
  });

  const { mutate: updateMerchant } = useMutation<Merchant, Error, { id: number; name: string }>({
    mutationFn: async (updatedMerchant) => {
      const response = await api.put<Merchant>(`/admin/merchant/${updatedMerchant.id}`, updatedMerchant);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      alert('가맹점 수정 성공!');
    },
  });

  const { mutate: deleteMerchant } = useMutation<void, Error, number>({
    mutationFn: async (merchantId) => {
      await api.delete(`/admin/merchant/${merchantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      alert('가맹점 삭제 성공!');
    },
  });

  const [newMerchantName, setNewMerchantName] = useState('');
  const [editMerchantId, setEditMerchantId] = useState<number | null>(null);
  const [editMerchantName, setEditMerchantName] = useState('');

  const handleAddMerchant = () => {
    if (newMerchantName) {
      addMerchant({ name: newMerchantName });
      setNewMerchantName('');
    }
  };

  const handleUpdateMerchant = (id: number) => {
    if (editMerchantName) {
      updateMerchant({ id, name: editMerchantName });
      setEditMerchantId(null);
      setEditMerchantName('');
    }
  };

  const handleEditMerchantClick = (merchant: Merchant) => {
    setEditMerchantId(merchant.id);
    setEditMerchantName(merchant.name);
  };

  // --- Category Management ---
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/admin/category');
      return response.data;
    },
  });

  const { mutate: addCategory } = useMutation<Category, Error, { name: string }>({
    mutationFn: async (newCategory) => {
      const response = await api.post<Category>('/admin/category', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      alert('카테고리 추가 성공!');
    },
  });

  const { mutate: updateCategory } = useMutation<Category, Error, { id: number; name: string }>({
    mutationFn: async (updatedCategory) => {
      const response = await api.put<Category>(`/admin/category/${updatedCategory.id}`, updatedCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      alert('카테고리 수정 성공!');
    },
  });

  const { mutate: deleteCategory } = useMutation<void, Error, number>({
    mutationFn: async (categoryId) => {
      await api.delete(`/admin/category/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      alert('카테고리 삭제 성공!');
    },
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName) {
      addCategory({ name: newCategoryName });
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = (id: number) => {
    if (editCategoryName) {
      updateCategory({ id, name: editCategoryName });
      setEditCategoryId(null);
      setEditCategoryName('');
    }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  // --- ESG Rule Management ---
  const { data: esgRules, isLoading: isLoadingEsgRules } = useQuery<EsgRule[], Error>({
    queryKey: ['esgRules'],
    queryFn: async () => {
      const response = await api.get<EsgRule[]>('/admin/esg-rule');
      return response.data;
    },
  });

  const { mutate: addEsgRule } = useMutation<EsgRule, Error, Omit<EsgRule, 'id'>>({
    mutationFn: async (newEsgRule) => {
      const response = await api.post<EsgRule>('/admin/esg-rule', newEsgRule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esgRules'] });
      alert('ESG 규칙 추가 성공!');
    },
  });

  const { mutate: updateEsgRule } = useMutation<EsgRule, Error, EsgRule>({
    mutationFn: async (updatedEsgRule) => {
      const response = await api.put<EsgRule>(`/admin/esg-rule/${updatedEsgRule.id}`, updatedEsgRule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esgRules'] });
      alert('ESG 규칙 수정 성공!');
    },
  });

  const { mutate: deleteEsgRule } = useMutation<void, Error, number>({
    mutationFn: async (esgRuleId) => {
      await api.delete(`/admin/esg-rule/${esgRuleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esgRules'] });
      alert('ESG 규칙 삭제 성공!');
    },
  });

  const [newEsgRule, setNewEsgRule] = useState({ name: '', description: '', points: 0 });
  const [editEsgRule, setEditEsgRule] = useState<EsgRule | null>(null);

  const handleAddEsgRule = () => {
    if (newEsgRule.name && newEsgRule.description) {
      addEsgRule(newEsgRule);
      setNewEsgRule({ name: '', description: '', points: 0 });
    }
  };

  const handleUpdateEsgRule = () => {
    if (editEsgRule) {
      updateEsgRule(editEsgRule);
      setEditEsgRule(null);
    }
  };

  const handleEditEsgRuleClick = (esgRule: EsgRule) => {
    setEditEsgRule(esgRule);
  };

  // --- Data Recalculation ---
  const { mutate: rebuildRanking } = useMutation<void, Error>({
    mutationFn: async () => {
      await api.post('/admin/ranking/rebuild');
    },
    onSuccess: () => {
      alert('랭킹 데이터 재계산 요청 성공!');
    },
    onError: (err) => {
      alert(`랭킹 데이터 재계산 요청 실패: ${err.message}`);
    },
  });

  const { mutate: rebuildReport } = useMutation<void, Error>({
    mutationFn: async () => {
      await api.post('/admin/report/rebuild');
    },
    onSuccess: () => {
      alert('리포트 데이터 재계산 요청 성공!');
    },
    onError: (err) => {
      alert(`리포트 데이터 재계산 요청 실패: ${err.message}`);
    },
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        backgroundColor: '#28a745',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5em' }}>관리자 페이지</h1>
        <nav>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px' }}>
            <li><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>대시보드</Link></li>
            <li><Link to="/transactions" style={{ color: 'white', textDecoration: 'none' }}>전체 내역</Link></li>
            <li><Link to="/submission" style={{ color: 'white', textDecoration: 'none' }}>거래 제출</Link></li>
            <li><Link to="/ranking" style={{ color: 'white', textDecoration: 'none' }}>랭킹</Link></li>
            <li><Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>리포트</Link></li>
            <li><Link to="/mypage" style={{ color: 'white', textDecoration: 'none' }}>마이페이지</Link></li>
            <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>관리자</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{
        flexGrow: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '1000px',
        }}>
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>관리자 대시보드</h2>

          <section style={{ marginBottom: '40px', border: '1px solid #eee', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>가맹점 관리</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="새 가맹점 이름"
                value={newMerchantName}
                onChange={(e) => setNewMerchantName(e.target.value)}
                style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button onClick={handleAddMerchant}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>추가</button>
            </div>
            {isLoadingMerchants ? (
              <p>가맹점 로딩 중...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {merchants?.map((merchant) => (
                  <li key={merchant.id} style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {editMerchantId === merchant.id ? (
                      <div style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
                        <input
                          type="text"
                          value={editMerchantName}
                          onChange={(e) => setEditMerchantName(e.target.value)}
                          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button onClick={() => handleUpdateMerchant(merchant.id)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>저장</button>
                        <button onClick={() => setEditMerchantId(null)}
                          style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>취소</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                        <span style={{ fontWeight: 'bold' }}>{merchant.name}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditMerchantClick(merchant)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>수정</button>
                          <button onClick={() => deleteMerchant(merchant.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>삭제</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ marginBottom: '40px', border: '1px solid #eee', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>카테고리 관리</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="새 카테고리 이름"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button onClick={handleAddCategory}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>추가</button>
            </div>
            {isLoadingCategories ? (
              <p>카테고리 로딩 중...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {categories?.map((category) => (
                  <li key={category.id} style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {editCategoryId === category.id ? (
                      <div style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button onClick={() => handleUpdateCategory(category.id)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>저장</button>
                        <button onClick={() => setEditCategoryId(null)}
                          style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>취소</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                        <span style={{ fontWeight: 'bold' }}>{category.name}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditCategoryClick(category)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>수정</button>
                          <button onClick={() => deleteCategory(category.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>삭제</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ marginBottom: '40px', border: '1px solid #eee', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>ESG 규칙 관리</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="새 ESG 규칙 이름"
                value={newEsgRule.name}
                onChange={(e) => setNewEsgRule({ ...newEsgRule, name: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="설명"
                value={newEsgRule.description}
                onChange={(e) => setNewEsgRule({ ...newEsgRule, description: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input
                type="number"
                placeholder="포인트"
                value={newEsgRule.points}
                onChange={(e) => setNewEsgRule({ ...newEsgRule, points: parseInt(e.target.value, 10) || 0 })}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button onClick={handleAddEsgRule}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>추가</button>
            </div>
            {isLoadingEsgRules ? (
              <p>ESG 규칙 로딩 중...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {esgRules?.map((esgRule) => (
                  <li key={esgRule.id} style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    padding: '15px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {editEsgRule?.id === esgRule.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                          <input
                            type="text"
                            value={editEsgRule.name}
                            onChange={(e) => setEditEsgRule({ ...editEsgRule, name: e.target.value })}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                          <input
                            type="text"
                            value={editEsgRule.description}
                            onChange={(e) => setEditEsgRule({ ...editEsgRule, description: e.target.value })}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                          <input
                            type="number"
                            value={editEsgRule.points}
                            onChange={(e) => setEditEsgRule({ ...editEsgRule, points: parseInt(e.target.value, 10) || 0 })}
                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button onClick={handleUpdateEsgRule}
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>저장</button>
                          <button onClick={() => setEditEsgRule(null)}
                            style={{
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>취소</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', width: '100%', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{esgRule.name}</span>
                        <span>{esgRule.description}</span>
                        <span>{esgRule.points} 점</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditEsgRuleClick(esgRule)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>수정</button>
                          <button onClick={() => deleteEsgRule(esgRule.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}>삭제</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>데이터 재계산</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => rebuildRanking()}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#138496')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#17a2b8')}
              >랭킹 데이터 재계산</button>
              <button onClick={() => rebuildReport()}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#138496')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#17a2b8')}
              >리포트 데이터 재계산</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Admin;