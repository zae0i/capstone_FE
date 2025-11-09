import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        email,
        password,
        nickname,
        region: region === "" ? null : region,
      };
      await api.post("/auth/signup", dataToSend);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          marginBottom: '30px',
          color: '#333'
        }}>회원가입</h1>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555'
            }}>이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: 'calc(100% - 20px)',
                padding: '12px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555'
            }}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: 'calc(100% - 20px)',
                padding: '12px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="nickname" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555'
            }}>닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              style={{
                width: 'calc(100% - 20px)',
                padding: '12px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label htmlFor="region" style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555'
            }}>지역</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                backgroundColor: '#fff'
              }}
            >
              <option value="">지역을 선택해주세요</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="인천">인천</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="경기">경기</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
          >
            가입하기
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
          이미 계정이 있으신가요? <Link to="/login" style={{ color: '#28a745', textDecoration: 'none' }}>로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
