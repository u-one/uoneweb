"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      color: '#333333'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Image
            src="/u-one_logo-3.png"
            alt="u-one logo"
            width={120}
            height={25}
            priority
          />
        </div>

        <Link
          href="/maps"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
          }}
        >
          🗺️ Maps
        </Link>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* プロフィールセクション */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            u-one
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#6c757d',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Android / Backend Software Engineer
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {/* スキルセクション */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '1rem'
              }}>
                💻 技術スタック
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• Android (Kotlin/Java)</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• Backend (Node.js/Python)</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• Web (React/Next.js)</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• GIS/Mapping</li>
              </ul>
            </div>

            {/* 興味・関心 */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '1rem'
              }}>
                🌟 興味・関心
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• 地図・GIS技術</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• オープンソース</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• モバイルアプリ開発</li>
                <li style={{ marginBottom: '0.5rem', color: '#495057' }}>• Web技術</li>
              </ul>
            </div>
          </div>
        </div>

        {/* プロジェクトセクション */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '1.5rem'
          }}>
            🚀 プロジェクト
          </h2>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              MapLibre GL Maps
            </h3>
            <p style={{
              color: '#6c757d',
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              MapLibre GLを使用したインタラクティブな地図アプリケーション。
              レイヤー管理、フィーチャー情報表示、URL連携などの機能を実装。
            </p>
            <Link
              href="/maps"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              デモを見る →
            </Link>
          </div>
        </div>

        {/* リンクセクション */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '1.5rem'
          }}>
            🔗 リンク
          </h2>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://github.com/u-one"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <Image
                src="/file.svg"
                alt="GitHub icon"
                width={16}
                height={16}
              />
              GitHub
            </a>

            <a
              href="https://x.com/uonejp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <Image
                src="/window.svg"
                alt="X icon"
                width={16}
                height={16}
              />
              X (Twitter)
            </a>

            <a
              href="https://blog.uoneweb.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <Image
                src="/globe.svg"
                alt="Blog icon"
                width={16}
                height={16}
              />
              Blog
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
