import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import { 
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
    ProviderListTitle,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText,
 } from './styles';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const [providers, setProviders] = useState<Provider[]>([]);

    const { signOut } = useAuth();
    const { user } = useAuth();
    const { navigate } = useNavigation();

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile= useCallback(() => {
        navigate('Profile');
        //signOut();
    //}, [signOut]);

    }, [navigate]);

    const deslogar = useCallback(() => {
       signOut();
    }, [signOut]);   

    const navigateToCreateAppointment = useCallback((providerId: string) => {
        navigate('CreateAppointment', { providerId });
    }, [navigate]);

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem vindo, {"\n"}
                    <UserName onPress={deslogar}>{user.name}</UserName>
                </HeaderTitle>  

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>          
            </Header>

            <ProvidersList style={styles.item}
                data={providers}
                keyExtractor={providers => providers.id}
                ListHeaderComponent={
                    <ProviderListTitle>Cabeleireiros</ProviderListTitle>
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />

                        <ProviderInfo>
                           <ProviderName>{provider.name}</ProviderName> 

                           <ProviderMeta>
                                <Icon name="calendar" size={14} color="#ff9000" />
                                <ProviderMetaText>Segunda à Sexta</ProviderMetaText>
                           </ProviderMeta>

                           <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                           </ProviderMeta>

                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    item: {
      marginHorizontal: 16,
      marginVertical: 16,
    }
  });

export default Dashboard;