'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('javascript', js)

export function ConflictResolverComponent() {
  const [files, setFiles] = useState([
    { id: 1, name: 'HeaderSection.jsx', resolved: true },
    { id: 2, name: 'next.config.js', resolved: true },
    { id: 3, name: 'custom_styles.build.css', resolved: true },
  ])

  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [selectedPanel, setSelectedPanel] = useState('main')

  const handlePanelSelect = (panel) => {
    setSelectedPanel(panel)
  }

  const navigateConflict = (direction) => {
    setSelectedFileIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % files.length
      } else {
        return (prevIndex - 1 + files.length) % files.length
      }
    })
  }

  return (
    <div className="flex h-screen bg-[#363848] text-gray-300">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1B26] flex flex-col border-r border-gray-700">
        <div className="p-4 flex items-center justify-between text-sm bg-[#1A1B26] h-14 border-b border-gray-700">
          <button className="text-gray-500 hover:text-gray-300" onClick={() => navigateConflict('prev')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[#74C991]">0 of 3 Conflicts</span>
          <button className="text-gray-500 hover:text-gray-300" onClick={() => navigateConflict('next')}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={file.id}
              className={`flex items-center p-4 hover:bg-[#2D2E3A] cursor-pointer ${
                index === selectedFileIndex ? 'bg-[#1A1B26] text-white' : ''
              }`}
              onClick={() => setSelectedFileIndex(index)}
            >
              <span className="w-6 h-6 mr-2 flex items-center justify-center text-sm bg-[#6183BB] rounded-full">
                {file.id}
              </span>
              <span className="flex-grow truncate text-sm">{file.name}</span>
              {file.resolved && (
                <div className="w-6 h-6 bg-[#74C991] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#1A1B26]" />
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="m-4 p-2 bg-[#385190] text-[#D4DBF8] rounded transition-colors duration-200 ease-in-out hover:bg-[#6183BB] hover:text-white" style={{ borderRadius: '4px' }}>
          Confirm Merge
        </button>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col gap-[1px] overflow-auto">
        <div className="grid grid-cols-3 gap-[1px] flex-grow overflow-auto">
          <CodePanel
            title="Main Branch Changes"
            bgColor="bg-[#7B67A3]"
            highlightColor="#3E3F67"
            isSelected={selectedPanel === 'main'}
            onSelect={() => handlePanelSelect('main')}
          />
          <CodePanel
            title="Original Code"
            bgColor="bg-[#894858]"
            highlightColor="#532938"
            isSelected={selectedPanel === 'original'}
            onSelect={() => handlePanelSelect('original')}
          />
          <CodePanel
            title="Your changes"
            bgColor="bg-[#546CA3]"
            highlightColor="#264A7D"
            isSelected={selectedPanel === 'yours'}
            onSelect={() => handlePanelSelect('yours')}
          />
        </div>
        <div className="flex-grow overflow-auto">
          <CodePanel 
            title="Result" 
            bgColor="bg-[#508366]" 
            highlightColor="#264934"
          />
        </div>
      </div>
    </div>
  )
}

function CodePanel({ title, bgColor, highlightColor, isSelected, onSelect }) {
  const [checkedLines, setCheckedLines] = useState({})

  const code = `
// Example JavaScript code
function exampleFunction() {
  const message = "Hello, world!";
  console.log(message);
  
  for (let i = 0; i < 5; i++) {
    console.log(\`Iteration \${i + 1}\`);
  }
  
  return {
    status: "success",
    data: {
      id: 1,
      name: "Example"
    }
  };
}

exampleFunction();
  `.trim()

  const customStyle = {
    ...atomOneDark,
    hljs: {
      ...atomOneDark.hljs,
      background: 'transparent',
    },
  }

  const toggleLineCheck = (lineNumber) => {
    setCheckedLines(prev => ({
      ...prev,
      [lineNumber]: !prev[lineNumber]
    }))
  }

  return (
    <div className="bg-[#1A1B26] overflow-hidden flex flex-col h-full">
      <div className={`h-14 ${bgColor} flex items-center`}>
        {onSelect && (
          <label className="flex items-center cursor-pointer ml-2">
            <input
              type="radio"
              className="sr-only"
              checked={isSelected}
              onChange={onSelect}
            />
            <div className={`w-6 h-6 border ${isSelected ? 'bg-green-500' : 'bg-transparent border-[#4D4F65]'} rounded-full`} />
          </label>
        )}
        <span className="flex-grow text-center text-[#1A1B26]">{title}</span>
      </div>
      <div className="flex-grow overflow-auto relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1E1F2B] text-[#363848] text-xs select-none flex flex-col" style={{ fontSize: '12px' }}>
          {code.split('\n').map((line, index) => (
            <div 
              key={index}
              className="flex items-center h-6 px-2"
              style={{
                backgroundColor: line.includes('name: "Example"') ? highlightColor : 'transparent',
                color: line.includes('name: "Example"') ? '#FFFFFF' : '#363848'
              }}
            >
              <label className="flex items-center cursor-pointer mr-1">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checkedLines[index + 1] || false}
                  onChange={() => toggleLineCheck(index + 1)}
                />
                <div 
                  className={`w-3 h-3 border flex items-center justify-center ${
                    checkedLines[index + 1] ? 'bg-[#74C991] border-[#74C991]' : 'border-[#4D4F65] bg-transparent'
                  }`}
                  style={{ opacity: index === 13 ? '100%' : '0%' }}
                >
                  {checkedLines[index + 1] && <Check className="w-2 h-2 text-[#1A1B26]" />}
                </div>
              </label>
              {index + 1}
            </div>
          ))}
        </div>
        <SyntaxHighlighter
          language="javascript"
          style={customStyle}
          customStyle={{
            fontSize: '12px',
            margin: 0,
            padding: '0 1rem 0 3rem',
            background: 'transparent',
          }}
          wrapLines={true}
          lineProps={lineNumber => {
            const line = code.split('\n')[lineNumber - 1];
            return {
              style: {
                backgroundColor: line && line.includes('name: "Example"') ? highlightColor : 'transparent',
                display: 'block',
                width: '100%',
                height: '24px',
                lineHeight: '24px',
                color: line && line.includes('name: "Example"') ? '#FFFFFF' : undefined,
              },
            };
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}