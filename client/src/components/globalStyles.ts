import { createGlobalStyle, DefaultTheme, GlobalStyleComponent } from 'styled-components';
import { ITheme } from './types';

export const GlobalStyles: GlobalStyleComponent<{}, DefaultTheme> = createGlobalStyle`

.container {

    background: ${({ theme }: ITheme<string>) => theme.body};

    color: ${({ theme }) => theme.text};

    .iconColor{color: ${({ theme }) => theme.text};
    transition: all 0.30s linear};

    .boxBtn button{color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.itemCategory};
    transition: all 0.30s linear};
    transition: all 0.50s linear;
    }
    .modal{background:${({ theme }) => theme.modal};
    transition: all 0.50s linear};

    .asideProfile .activeFilter{color: ${({ theme }) => theme.btnHistory}!important;
      transition: all 0.30s linear};

    main{ 
        background: ${({ theme }) => theme.body};
        transition: all 0.50s linear;
    }

    .add{ background: ${({ theme }) => theme.boxBackground};
    transition: all 0.50s linear;}

    .account{ background: ${({ theme }) => theme.boxBackground};
    transition: all 0.50s linear;}

    .categories{ background: ${({ theme }) => theme.boxBackground};
    transition: all 0.50s linear;}

    .itemCategory{background: ${({ theme }) => theme.itemCategory};
    transition: all 0.30s linear;}

    .asideProfile{ background: ${({ theme }) => theme.boxBackground};
    transition: all 0.50s linear;}
    .amountHistory{ color: ${({ theme }) => theme.amountHistory};}
    .expenseBackground{background: ${({ theme }) => theme.pink}}
    .incomeBackground{background: ${({ theme }) => theme.green}}
    label{ color: ${({ theme }) => theme.amountHistory};}
`;
