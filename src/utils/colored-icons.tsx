import React from "react";

const ColoredIcons = {
    boots: {
        normal: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.5116 12.7309C28.3651 11.9344 28.3047 11.9564 27.2839 13.9218C26.9629 14.5399 26.5233 15.3861 25.8713 16.4689C21.952 22.9812 13.6344 25.2262 13.2418 25.3284C10.7381 25.3305 9.06265 25.8303 8.2623 26.8148C7.77019 27.4199 7.77978 28.0164 7.80064 28.218C7.38811 28.5992 7.18629 28.9875 7.20067 29.3725C7.21913 29.8774 7.60552 30.1782 7.61775 30.1871C7.71243 30.2668 10.0972 32.1425 23.7723 32.563C25.4979 32.6159 27.0732 32.6391 28.5087 32.6391C38.4359 32.6391 41.6857 31.5345 41.7219 31.522L41.8005 31.4269C42.1982 28.8798 41.9271 27.9653 41.6298 27.6466C41.5685 27.5809 41.5078 27.542 41.4553 27.5191C41.6188 26.8103 41.5848 25.6992 41.4553 24.2391L27.7539 23.7673C27.7539 23.7673 32.2578 18.0174 35.3428 14.2666C33.0258 13.6623 31.5361 13.1109 30.5116 12.7309Z"
                    fill="#FFCC66"/>
                <path
                    d="M18.2159 22.3977L21.6359 25.0353M5.51895 28.5583C5.51895 28.5583 5.08563 25.8087 10.9758 25.8087C10.9758 25.8087 19.4514 23.5567 23.519 16.7983C27.5865 10.0408 23.3656 12.9968 37.1563 15.6719C37.1563 15.6719 37.9651 15.7128 37.919 16.5583C37.8716 17.4027 39.6347 25.9026 39.027 27.9664C39.027 27.9664 40.0082 27.8735 39.4002 31.7673C39.4002 31.7673 35.2865 33.2237 21.4949 32.8015C7.70424 32.3773 5.41365 30.4537 5.41365 30.4537C5.41365 30.4537 4.30332 29.6383 5.51895 28.5583ZM24.935 14.525C24.935 14.525 26.9968 15.2794 29.1592 13.7705L24.935 14.525ZM5.99895 28.492C5.99895 28.492 26.9317 31.7375 39.119 27.8383L5.99895 28.492ZM38.2437 16.3269C38.2437 16.3269 40.9929 16.3144 38.5994 20.4556L38.2437 16.3269ZM23.6553 16.8669L28.3471 20.2238L23.6553 16.8669ZM22.1553 18.9348L26.574 22.0848L22.1553 18.9348ZM20.3443 20.7561L24.6012 24.0393L20.3443 20.7561Z"
                    stroke="#231F20"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        ),
        off: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30.5116 12.7309C28.3651 11.9344 28.3047 11.9564 27.2839 13.9218C26.9629 14.5399 26.5233 15.3861 25.8713 16.4689C21.952 22.9812 13.6344 25.2262 13.2418 25.3284C10.7381 25.3305 9.06265 25.8303 8.2623 26.8148C7.77019 27.4199 7.77978 28.0164 7.80064 28.218C7.38811 28.5992 7.18629 28.9875 7.20067 29.3725C7.21913 29.8774 7.60552 30.1782 7.61775 30.1871C7.71243 30.2668 10.0972 32.1425 23.7723 32.563C25.4979 32.6159 27.0732 32.6391 28.5087 32.6391C38.4359 32.6391 41.6857 31.5345 41.7219 31.522L41.8005 31.4269C42.1982 28.8798 41.9271 27.9653 41.6298 27.6466C41.5685 27.5809 41.5078 27.542 41.4553 27.5191C41.6188 26.8103 41.5848 25.6992 41.4553 24.2391L27.7539 23.7673C27.7539 23.7673 32.2578 18.0174 35.3428 14.2666C33.0258 13.6623 31.5361 13.1109 30.5116 12.7309Z"
                    fill="#D1D1D6"/>
                <path
                    d="M18.2159 22.3977L21.6359 25.0353M5.51895 28.5583C5.51895 28.5583 5.08563 25.8087 10.9758 25.8087C10.9758 25.8087 19.4514 23.5567 23.519 16.7983C27.5865 10.0408 23.3656 12.9968 37.1563 15.6719C37.1563 15.6719 37.9651 15.7128 37.919 16.5583C37.8716 17.4027 39.6347 25.9026 39.027 27.9664C39.027 27.9664 40.0082 27.8735 39.4002 31.7673C39.4002 31.7673 35.2865 33.2237 21.4949 32.8015C7.70424 32.3773 5.41365 30.4537 5.41365 30.4537C5.41365 30.4537 4.30332 29.6383 5.51895 28.5583ZM24.935 14.525C24.935 14.525 26.9968 15.2794 29.1592 13.7705L24.935 14.525ZM5.99895 28.492C5.99895 28.492 26.9317 31.7375 39.119 27.8383L5.99895 28.492ZM38.2437 16.3269C38.2437 16.3269 40.9929 16.3144 38.5994 20.4556L38.2437 16.3269ZM23.6553 16.8669L28.3471 20.2238L23.6553 16.8669ZM22.1553 18.9348L26.574 22.0848L22.1553 18.9348ZM20.3443 20.7561L24.6012 24.0393L20.3443 20.7561Z"
                    stroke="#231F20"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        ),
    },
    clothes: {
        normal: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 10.56V22.8H34.5599V19.68L38.5317 21.9641L42.3592 16.2746L34.5599 10.56H30.4799H30.2399L28.7999 7.91998L25.6799 10.56Z"
                    fill="#FFCC66"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 26.4H34.5599V24H25.6799V26.4Z"
                    fill="#FFCC66"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 30H34.5599V27.6H25.6799V30Z"
                    fill="#FFA458"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 33.6H34.5599V31.2H25.6799V33.6Z"
                    fill="#FFCC66"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.64 40.56H34.56V34.8H14.64V40.56Z"
                    fill="#FFE258"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.5685 9.84003H28.7348H28.3204L27.4399 13.5632L23.4516 10.2537H23.3481L19.3598 13.5632L18.4793 9.84003H18.0649H14.2314C14.0973 9.84003 13.9668 9.88326 13.8595 9.9633L6.72972 15.2783C6.46411 15.4761 6.40071 15.8471 6.58572 16.1218L9.76142 20.8345C9.88097 21.012 10.0772 21.1088 10.2777 21.1088C10.3852 21.1088 10.494 21.0811 10.5928 21.0227L14.1284 18.9411V40.6595C14.1284 41.0022 14.4067 41.28 14.75 41.28H22.8301H23.9696H32.0497C32.393 41.28 32.6713 41.0022 32.6713 40.6595V18.9411L36.2069 21.0227C36.3057 21.0809 36.4145 21.1088 36.5222 21.1088C36.7227 21.1088 36.9187 21.012 37.0383 20.8345L40.214 16.1218C40.399 15.8471 40.3356 15.4761 40.0702 15.2783L32.9404 9.9633C32.8329 9.88326 32.7024 9.84003 32.5685 9.84003ZM32.4677 10.56L39.3599 15.7346L36.4136 20.1383L33.0581 18.1485C32.9287 18.0717 32.7838 18.0333 32.6386 18.0333C32.4974 18.0333 32.356 18.0696 32.229 18.1427C31.9718 18.2905 31.8128 18.5656 31.8128 18.8637V40.32H14.987V18.8637C14.987 18.5656 14.8282 18.2905 14.5708 18.1427C14.4438 18.0696 14.3026 18.0333 14.1612 18.0333C14.016 18.0333 13.8711 18.0717 13.7416 18.1485L10.3862 20.1383L7.4399 15.7346L14.3323 10.56H17.8432L18.5704 13.6571C18.636 13.9369 18.841 14.1626 19.1123 14.2537C19.1978 14.2825 19.2861 14.2967 19.3741 14.2967C19.5642 14.2967 19.7515 14.2307 19.902 14.1049L23.3999 11.1816L26.8978 14.1049C27.0483 14.2307 27.2356 14.2967 27.4257 14.2967C27.5137 14.2967 27.602 14.2825 27.6877 14.2537C27.9588 14.1626 28.1636 13.9369 28.2294 13.6571L28.9568 10.56H32.4677Z"
                    fill="#231F20"/>
                <path
                    d="M28.703 10.2745L26.8408 7.17102H20.0133L18.1511 10.2745"
                    stroke="#231F20"
                    strokeLinejoin="round"/>
                <path
                    d="M26.6345 7.30951L23.4965 10.6887M20.1863 7.30951L23.3243 10.6887L20.1863 7.30951Z"
                    stroke="#231F20"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.48 25.2C24.48 25.8626 23.9428 26.4 23.28 26.4C22.6171 26.4 22.08 25.8626 22.08 25.2C22.08 24.5372 22.6171 24 23.28 24C23.9428 24 24.48 24.5372 24.48 25.2ZM24.48 28.8C24.48 29.4626 23.9428 30 23.28 30C22.6171 30 22.08 29.4626 22.08 28.8C22.08 28.1374 22.6171 27.6 23.28 27.6C23.9428 27.6 24.48 28.1374 24.48 28.8ZM24.48 32.4C24.48 33.0626 23.9428 33.6 23.28 33.6C22.6171 33.6 22.08 33.0626 22.08 32.4C22.08 31.7374 22.6171 31.2 23.28 31.2C23.9428 31.2 24.48 31.7374 24.48 32.4Z"
                    fill="#FFA458"/>
                <path
                    d="M24 11.04H23.04V16.8H24V11.04Z"
                    fill="#231F20"/>
            </svg>
        ),
        off: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 10.56V22.8H34.5599V19.68L38.5317 21.9641L42.3592 16.2746L34.5599 10.56H30.4799H30.2399L28.7999 7.91998L25.6799 10.56Z"
                    fill="#D1D1D6"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 26.4H34.5599V24H25.6799V26.4Z"
                    fill="#D1D1D6"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 30H34.5599V27.6H25.6799V30Z"
                    fill="#8E8E93"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.6799 33.6H34.5599V31.2H25.6799V33.6Z"
                    fill="#D1D1D6"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.64 40.56H34.56V34.8H14.64V40.56Z"
                    fill="#EFEFF4"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.5685 9.84003H28.7348H28.3204L27.4399 13.5632L23.4516 10.2537H23.3481L19.3598 13.5632L18.4793 9.84003H18.0649H14.2314C14.0973 9.84003 13.9668 9.88326 13.8595 9.9633L6.72972 15.2783C6.46411 15.4761 6.40071 15.8471 6.58572 16.1218L9.76142 20.8345C9.88097 21.012 10.0772 21.1088 10.2777 21.1088C10.3852 21.1088 10.494 21.0811 10.5928 21.0227L14.1284 18.9411V40.6595C14.1284 41.0022 14.4067 41.28 14.75 41.28H22.8301H23.9696H32.0497C32.393 41.28 32.6713 41.0022 32.6713 40.6595V18.9411L36.2069 21.0227C36.3057 21.0809 36.4145 21.1088 36.5222 21.1088C36.7227 21.1088 36.9187 21.012 37.0383 20.8345L40.214 16.1218C40.399 15.8471 40.3356 15.4761 40.0702 15.2783L32.9404 9.9633C32.8329 9.88326 32.7024 9.84003 32.5685 9.84003ZM32.4677 10.56L39.3599 15.7346L36.4136 20.1383L33.0581 18.1485C32.9287 18.0717 32.7838 18.0333 32.6386 18.0333C32.4974 18.0333 32.356 18.0696 32.229 18.1427C31.9718 18.2905 31.8128 18.5656 31.8128 18.8637V40.32H14.987V18.8637C14.987 18.5656 14.8282 18.2905 14.5708 18.1427C14.4438 18.0696 14.3026 18.0333 14.1612 18.0333C14.016 18.0333 13.8711 18.0717 13.7416 18.1485L10.3862 20.1383L7.4399 15.7346L14.3323 10.56H17.8432L18.5704 13.6571C18.636 13.9369 18.841 14.1626 19.1123 14.2537C19.1978 14.2825 19.2861 14.2967 19.3741 14.2967C19.5642 14.2967 19.7515 14.2307 19.902 14.1049L23.3999 11.1816L26.8978 14.1049C27.0483 14.2307 27.2356 14.2967 27.4257 14.2967C27.5137 14.2967 27.602 14.2825 27.6877 14.2537C27.9588 14.1626 28.1636 13.9369 28.2294 13.6571L28.9568 10.56H32.4677Z"
                    fill="#231F20"/>
                <path
                    d="M28.703 10.2745L26.8408 7.17102H20.0133L18.1511 10.2745"
                    stroke="#231F20"
                    strokeLinejoin="round"/>
                <path
                    d="M26.6345 7.30951L23.4965 10.6887M20.1863 7.30951L23.3243 10.6887L20.1863 7.30951Z"
                    stroke="#231F20"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24.48 25.2C24.48 25.8626 23.9428 26.4 23.28 26.4C22.6171 26.4 22.08 25.8626 22.08 25.2C22.08 24.5372 22.6171 24 23.28 24C23.9428 24 24.48 24.5372 24.48 25.2ZM24.48 28.8C24.48 29.4626 23.9428 30 23.28 30C22.6171 30 22.08 29.4626 22.08 28.8C22.08 28.1374 22.6171 27.6 23.28 27.6C23.9428 27.6 24.48 28.1374 24.48 28.8ZM24.48 32.4C24.48 33.0626 23.9428 33.6 23.28 33.6C22.6171 33.6 22.08 33.0626 22.08 32.4C22.08 31.7374 22.6171 31.2 23.28 31.2C23.9428 31.2 24.48 31.7374 24.48 32.4Z"
                    fill="#8E8E93"/>
                <path
                    d="M24 11.04H23.04V16.8H24V11.04Z"
                    fill="#231F20"/>
            </svg>
        )
    },
    lux: {
        normal: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    d="M42.4782 12.7678H33.9102V31.1038H42.4782V12.7678Z"
                    fill="#FFE258"/>
                <path
                    d="M32.782 12.7678H10.582V31.1038H32.782V12.7678Z"
                    fill="#FFCC66"/>
                <path
                    d="M22.101 21.5995C22.341 21.5995 22.533 21.7915 22.533 22.0555V22.2955C23.133 22.3675 23.637 22.5595 24.117 22.8715C24.285 22.9675 24.429 23.1355 24.429 23.3755C24.429 23.7115 24.165 23.9515 23.853 23.9515C23.757 23.9515 23.637 23.9275 23.541 23.8555C23.181 23.6395 22.845 23.4715 22.485 23.3995V25.4155C24.021 25.8235 24.693 26.4475 24.693 27.5755C24.693 28.7275 23.829 29.4955 22.533 29.6395V30.2635C22.533 30.5275 22.341 30.7195 22.101 30.7195C21.861 30.7195 21.645 30.5275 21.645 30.2635V29.6155C20.877 29.5195 20.181 29.2555 19.557 28.7995C19.389 28.6795 19.293 28.5115 19.293 28.2955C19.293 27.9595 19.533 27.7195 19.845 27.7195C19.965 27.7195 20.085 27.7675 20.181 27.8395C20.661 28.1995 21.117 28.4395 21.693 28.5355V26.4715C20.205 26.0635 19.509 25.4875 19.509 24.3115C19.509 23.1835 20.373 22.4155 21.645 22.2955V22.0795C21.669 21.7915 21.861 21.5995 22.101 21.5995ZM21.693 25.1755V23.3035C21.045 23.3755 20.709 23.7355 20.709 24.1915C20.733 24.6475 20.925 24.9115 21.693 25.1755ZM22.509 26.6395V28.5595C23.157 28.4875 23.517 28.1515 23.517 27.6475C23.517 27.1915 23.277 26.9035 22.509 26.6395Z"
                    fill="black"/>
                <path
                    d="M38.2079 16.8733H6.33594V35.2093H38.2079V16.8733Z"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M38.2328 20.6413C36.1448 20.6413 34.4648 18.9613 34.4648 16.8733"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M34.4648 35.2091C34.4648 33.1211 36.1448 31.4411 38.2328 31.4411"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M6.33594 20.6413C8.42394 20.6413 10.1039 18.9613 10.1039 16.8733"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M10.1039 35.2091C10.1039 33.1211 8.42394 31.4411 6.33594 31.4411"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        ),
        off: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    d="M42.4782 12.7678H33.9102V31.1038H42.4782V12.7678Z"
                    fill="#E5E5E5"/>
                <path
                    d="M32.782 12.7678H10.582V31.1038H32.782V12.7678Z"
                    fill="#D1D1D6"/>
                <path
                    d="M22.101 21.5995C22.341 21.5995 22.533 21.7915 22.533 22.0555V22.2955C23.133 22.3675 23.637 22.5595 24.117 22.8715C24.285 22.9675 24.429 23.1355 24.429 23.3755C24.429 23.7115 24.165 23.9515 23.853 23.9515C23.757 23.9515 23.637 23.9275 23.541 23.8555C23.181 23.6395 22.845 23.4715 22.485 23.3995V25.4155C24.021 25.8235 24.693 26.4475 24.693 27.5755C24.693 28.7275 23.829 29.4955 22.533 29.6395V30.2635C22.533 30.5275 22.341 30.7195 22.101 30.7195C21.861 30.7195 21.645 30.5275 21.645 30.2635V29.6155C20.877 29.5195 20.181 29.2555 19.557 28.7995C19.389 28.6795 19.293 28.5115 19.293 28.2955C19.293 27.9595 19.533 27.7195 19.845 27.7195C19.965 27.7195 20.085 27.7675 20.181 27.8395C20.661 28.1995 21.117 28.4395 21.693 28.5355V26.4715C20.205 26.0635 19.509 25.4875 19.509 24.3115C19.509 23.1835 20.373 22.4155 21.645 22.2955V22.0795C21.669 21.7915 21.861 21.5995 22.101 21.5995ZM21.693 25.1755V23.3035C21.045 23.3755 20.709 23.7355 20.709 24.1915C20.733 24.6475 20.925 24.9115 21.693 25.1755ZM22.509 26.6395V28.5595C23.157 28.4875 23.517 28.1515 23.517 27.6475C23.517 27.1915 23.277 26.9035 22.509 26.6395Z"
                    fill="black"/>
                <path
                    d="M38.2079 16.8733H6.33594V35.2093H38.2079V16.8733Z"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M38.2328 20.6413C36.1448 20.6413 34.4648 18.9613 34.4648 16.8733"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M34.4648 35.2091C34.4648 33.1211 36.1448 31.4411 38.2328 31.4411"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M6.33594 20.6413C8.42394 20.6413 10.1039 18.9613 10.1039 16.8733"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M10.1039 35.2091C10.1039 33.1211 8.42394 31.4411 6.33594 31.4411"
                    stroke="black"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        )
    },
    event: {
        normal: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M47.5 24C47.5 36.9787 36.9787 47.5 24 47.5C11.0213 47.5 0.5 36.9787 0.5 24C0.5 11.0213 11.0213 0.5 24 0.5C36.9787 0.5 47.5 11.0213 47.5 24Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 38H37V30H11V38Z"
                    fill="#FFE258"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21 18H37V11H21V18Z"
                    fill="#FFCC66"/>
                <path
                    d="M32.75 13.9982H15.25C13.8693 13.9982 12.75 15.1175 12.75 16.4982V33.9982C12.75 35.3789 13.8693 36.4982 15.25 36.4982H32.75C34.1307 36.4982 35.25 35.3789 35.25 33.9982V16.4982C35.25 15.1175 34.1307 13.9982 32.75 13.9982Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M28.9982 11.5018V16.5018"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M19.0018 11.5018V16.5018"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M12.75 21.4982H35.25"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        ),
        off: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M47.5 24C47.5 36.9787 36.9787 47.5 24 47.5C11.0213 47.5 0.5 36.9787 0.5 24C0.5 11.0213 11.0213 0.5 24 0.5C36.9787 0.5 47.5 11.0213 47.5 24Z"
                    fill="white"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 38H37V30H11V38Z"
                    fill="#E5E5E5"/>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21 18H37V11H21V18Z"
                    fill="#D1D1D6"/>
                <path
                    d="M32.75 13.9982H15.25C13.8693 13.9982 12.75 15.1175 12.75 16.4982V33.9982C12.75 35.3789 13.8693 36.4982 15.25 36.4982H32.75C34.1307 36.4982 35.25 35.3789 35.25 33.9982V16.4982C35.25 15.1175 34.1307 13.9982 32.75 13.9982Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M28.9982 11.5018V16.5018"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M19.0018 11.5018V16.5018"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
                <path
                    d="M12.75 21.4982H35.25"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
        )
    },
    'commercial-building': {
        normal: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    d="M41.6164 36.4796V24.5516H31.3204V17.1356L21.8884 21.4076V17.1356L11.5444 21.8396V36.4796H41.6164ZM16.6564 31.2716H15.3364V29.9516H16.6564V31.2716ZM16.6564 28.6796H15.3364V27.3596H16.6564V28.6796ZM19.2484 31.2716H17.9284V29.9516H19.2484V31.2716ZM19.2484 28.6796H17.9284V27.3596H19.2484V28.6796ZM21.8164 31.2716H20.4964V29.9516H21.8164V31.2716ZM21.8164 28.6796H20.4964V27.3596H21.8164V28.6796ZM35.5444 27.3596H36.8644V28.6796H35.5444V27.3596ZM35.5444 29.9516H36.8644V31.2716H35.5444V29.9516ZM34.2964 31.2716H32.9764V29.9516H34.2964V31.2716ZM34.2964 28.6796H32.9764V27.3596H34.2964V28.6796ZM37.0084 35.8316H35.4484V33.1916H37.0084V35.8316ZM39.4564 31.2716H38.1364V29.9516H39.4564V31.2716ZM39.4564 28.6796H38.1364V27.3596H39.4564V28.6796Z"
                    fill="#FFE258"/>
                <path
                    d="M37.032 36.12V24.192H35.64V22.896H34.872V10.08H33.432V22.92H32.664V24.216H31.728V22.92H30.96V14.784H29.52V22.896H28.752V24.192H26.76V16.776L17.328 21.048V16.776L6.95996 21.48V36.12H37.032Z"
                    stroke="black"
                    strokeMiterlimit="10"/>
            </svg>
        ),
        off: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                    fill="white"/>
                <path
                    d="M41.6164 36.4796V24.5516H31.3204V17.1356L21.8884 21.4076V17.1356L11.5444 21.8396V36.4796H41.6164ZM16.6564 31.2716H15.3364V29.9516H16.6564V31.2716ZM16.6564 28.6796H15.3364V27.3596H16.6564V28.6796ZM19.2484 31.2716H17.9284V29.9516H19.2484V31.2716ZM19.2484 28.6796H17.9284V27.3596H19.2484V28.6796ZM21.8164 31.2716H20.4964V29.9516H21.8164V31.2716ZM21.8164 28.6796H20.4964V27.3596H21.8164V28.6796ZM35.5444 27.3596H36.8644V28.6796H35.5444V27.3596ZM35.5444 29.9516H36.8644V31.2716H35.5444V29.9516ZM34.2964 31.2716H32.9764V29.9516H34.2964V31.2716ZM34.2964 28.6796H32.9764V27.3596H34.2964V28.6796ZM37.0084 35.8316H35.4484V33.1916H37.0084V35.8316ZM39.4564 31.2716H38.1364V29.9516H39.4564V31.2716ZM39.4564 28.6796H38.1364V27.3596H39.4564V28.6796Z"
                    fill="#D1D1D6"/>
                <path
                    d="M37.032 36.12V24.192H35.64V22.896H34.872V10.08H33.432V22.92H32.664V24.216H31.728V22.92H30.96V14.784H29.52V22.896H28.752V24.192H26.76V16.776L17.328 21.048V16.776L6.95996 21.48V36.12H37.032Z"
                    stroke="black"
                    strokeMiterlimit="10"/>
            </svg>
        )
    }
};

export type TColoredIconNames =
  | 'boots'
  | 'clothes'
  | 'lux'
  | 'event'
  | 'commercial-building';

export type TColoredIconTypes = 'normal' | 'off';

export default ColoredIcons;