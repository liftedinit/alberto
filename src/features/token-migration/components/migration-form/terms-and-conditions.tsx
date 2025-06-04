import React from "react"
import { Box } from "@liftedinit/ui"
import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"

export const TokenMigrationTermsAndConditions: React.FC = () => {
  return (
    <Box maxH="700px" overflowY="auto" p={4}>
      <ReactMarkdown
        components={ChakraUIRenderer()}
        children={TermsAndConditions}
        skipHtml
      />
    </Box>
  )
}

const TermsAndConditions = `
### MFX Token Migration Terms and Conditions

PLEASE READ THESE TOKEN MIGRATION TERMS AND CONDITIONS (AS AMENDED AS
PROVIDED HEREIN, THE "TERMS") CAREFULLY BEFORE USING
<https://alberto.app/#/> (THE "WEBSITE"), AS THEY CONTAIN AN AGREEMENT
TO ARBITRATE AND OTHER IMPORTANT INFORMATION REGARDING YOUR LEGAL
RIGHTS, REMEDIES, AND OBLIGATIONS. THE AGREEMENT TO ARBITRATE (SET FORTH
IN SECTION 11 BELOW) REQUIRES (WITH LIMITED EXCEPTIONS) THAT YOU SUBMIT
CLAIMS YOU HAVE AGAINST US TO BINDING AND FINAL ARBITRATION, AND FURTHER
(1) YOU WILL BE PERMITTED TO PURSUE CLAIMS AGAINST US ONLY ON AN
INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR
REPRESENTATIVE ACTION OR PROCEEDING, AND (2) YOU WILL BE PERMITTED TO
SEEK RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF)
ONLY ON AN INDIVIDUAL BASIS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT
PARTICIPATE IN THE TOKEN MIGRATION.

The Terms are entered into by and between the Website user ("you/your")
and Manifest Network, Ltd. (the "Company" or "we/our/us").

#### 1.  Purpose and Use of Tokens

The purpose of the Mainnet MFX Tokens (the "Mainnet Tokens") is to
incentivize users to participate in the Manifest Network, a
blockchain-based ecosystem created by the Company (the "Manifest
Network"), including but not limited to various decentralized
applications and services (collectively, the "Services"). Mainnet Tokens
are only for use in connection with the Manifest Network application
under the Terms and only constitute a transferable representation of
attributed functions of the Manifest Network.

The Alpha Network MFX Tokens (the "Alpha Tokens") were deployed on a
prior legacy test network (the "Alpha Network") solely for testing and
development purposes prior to the Token Migration to Mainnet Tokens. The
term "Tokens" as used herein means collectively the Alpha Tokens and the
Mainnet Tokens.

#### 2.  Use of the Token Migration

Unless otherwise stated in these Terms, these Terms govern only your migration
of Alpha Tokens for Mainnet Tokens during the Migration Period (the “Token
Migration”). The migration is only available to existing holders of Alpha
Tokens, and no additional consideration is paid for participating in the Token
Migration.

The Company has developed the Manifest Network and is supporting an extended
period for Alpha Token holders to participate in the Token Migration.

You affirm that you are aware and acknowledge that the Company is a
non-custodial provider of services, meaning that the Company does not have
custody, control or manage user funds in any manner whatsoever.

YOU AGREE AND CERTIFY THAT YOU ARE MIGRATING ALPHA TOKENS DURING THE TOKEN
MIGRATION FOR YOUR OWN PERSONAL USE AND UTILITY AND TO PARTICIPATE ON THE
MAINNET NETWORK, AND NOT FOR INVESTMENT, FOR DISTRIBUTION OR FOR FINANCIAL
PURPOSES. YOU AGREE AND CERTIFY THAT TOKENS ARE NOT A SECURITY OR DERIVATIVE AND
YOU ACKNOWLEDGE THAT TOKENS MAY LOSE ALL VALUE. Mainnet Tokens are digital
assets used on the Manifest Network. By agreeing with these Terms, you affirm
that you understand and agree with all concepts described herein.

By engaging in the Website and the Token Migration, you represent and warrant to
us that:

a. You are eligible to enter this Terms in accordance with Section 3 below.
b. These Terms are valid, and binding on you, and enforceable against you.
c. You will comply with all terms and conditions under these Terms.
d. You acknowledge and agree that from time to time the Website may be
   inaccessible or inoperable for any reason, including, without limitation: (i)
   equipment malfunctions; (ii) periodic maintenance procedures or repairs which
   the Company may undertake from time to time; (iii) causes beyond the control of
   Association or which are not reasonably foreseeable by the Company; (iv)
   disruptions and temporary or permanent unavailability of the underlying
   blockchain infrastructure; (v) unavailability of third party service providers
   or external partners for any reason. In this case, you may be prevented from
   accessing or using the Services.
e. You acknowledge and agree that the Website may evolve over time. This means
   the Company may apply changes, replace, or discontinue (temporarily or
   permanently) the Website at any time in our sole discretion.
f. You acknowledge and agree that any pricing information provided on the
   Website does not represent an offer, a solicitation of an offer, or any advice
   regarding, or recommendation to enter into, a transaction with us.
g. You acknowledge and agree that the Company does not act as an agent for any
   of the users.
h. You are solely responsible for your use of the Website for the Token Migration.
i. In connection with using the Token Migration, you will only migrate legally
   obtained Alpha Tokens that belong to you.
j. You will obey all applicable laws in connection with using the Website. You
   will not use the Website if the laws of your country, or any other applicable
   law, prohibit you from doing so in accordance with these Terms.
k. You are solely responsible for reporting and paying any taxes applicable to
   your use of the Website.
l. You are solely responsible for maintaining a record of all transactions and
   acknowledge that access to records including via a blockchain explorer will no
   longer be available after the Token Migration.
m. You are not and have not been placed on any excluded or denied persons lists
   by any authority.
n. You are responsible for complying with any applicable export controls or embargoes.
o. Any Alpha Tokens used by you in connection with the Token Migration are
   either owned by you or that you are validly authorized to carry out actions
   using such Alpha Tokens.
p. You acknowledge and agree that we have no control over, or liability for, the
   delivery, quality, safety, legality or any other aspect of any Tokens that you
   may transfer to or from a third party, and that we are not responsible for
   ensuring that an entity with whom you transact actually completes the
   transaction or is authorized to do so. If you experience a problem with any
   Token purchased from or sold to a third party through the Website, you bear the
   entire risk.
q. You covenant that all activity and conduct in connection with your use of the
   Services, including any resultant transactions of the Digital Assets, will be in
   compliance with all applicable law, rules, regulations, requirements, guidelines
   and policies of any governmental or quasi-governmental body or regulatory
   agency, any self-regulatory organization.

#### 3.  Eligibility

By using the Website, you represent and warrant that you are of the legal age of
majority in your jurisdiction as is required to access the Website. You further
represent that you are legally permitted to use Website in your jurisdiction
including owning cryptographic tokens of value and interacting with the Manifest
Network in any way. You further represent that you are responsible for ensuring
full compliance with the applicable laws in your jurisdiction and acknowledge
that we are not liable for your compliance and failure to comply with such laws.

#### 4.  Principles

You understand and accept that while the individuals and entities, including the
Company, assigned to this task, will make reasonable efforts to continue to
develop and complete the Manifest Network, it is possible that such development
may fail and your Tokens may become useless and/or valueless due to technical,
commercial, regulatory or any other reasons.

You are aware of the risk that even if all or parts of the Manifest Network are
successfully developed and released in full or in parts, due to a lack of public
interest, the Manifest Network could be fully or partially abandoned, remain
commercially unsuccessful or shut down for lack of interest, regulatory or other
reasons. You therefore understand and accept that your migration of Alpha Tokens
carries significant financial, regulatory and/or reputational risks (including
the complete loss of value of Mainnet Tokens and attributed features of the
Manifest Network).

Neither this document nor any other document or communication may modify or add
any additional obligations to the Company and/or any other person, entity and/or
affiliates involved with the deployment or operation of the Manifest Network.

By migrating Alpha Tokens to Mainnet Tokens you expressly agree to all of these
Terms. You further confirm to have carefully reviewed these Terms and to fully
understand the risks of migrating Alpha Tokens to Mainnet Tokens.

This document does not constitute a prospectus of any sort, is not a
solicitation for investment and does not pertain in any way to an initial public
offering or a share/equity offering and does not pertain in any way to an
offering of securities in any jurisdiction. It is a description of the migration
of Tokens.

By migrating Tokens, no form of partnership, joint venture, agency or any
similar relationship between you and the Company and/or other individuals or
entities involved with the deployment or operation of the Manifest Network is
created.

#### 5.  Cancellation; Rescission

Your migration of Tokens during the Migration Period is final, and there are no
refunds, cancellations or rescissions except as may be required by applicable
law or regulation. By participating in the Token Migration, you acknowledge and
agree unconditionally and irrevocably to waive any right of set-off, netting,
counterclaim, abatement or other similar remedy which you might otherwise have
in respect of any Tokens or under these Terms under the laws of any
jurisdiction.

#### 6.  Token Migration Procedures and Specifications

a. Accepted Tokens. Only Alpha Tokens are accepted in exchange for Mainnet Tokens.
   The Manifest Network does not accept any other type of token or currency.
   
b. Migration Period. Alpha Tokens may be submitted in exchange for Mainnet
   Tokens, on a 1-for-10 ratio, beginning on July 15th, 2025, at 12:00 pm EST and
   will continue indefinitely until the Alpha Network is no longer supported by The
   Lifted Initiative, Inc. (issuer of the Alpha Tokens) (the “Migration Period”).
   
c. Alpha Tokens exchanged for Mainnet Tokens will be permanently decommissioned.

d. Migration Fees. There will be no fees associated with the Token Migration.

e. Transferability of Mainnet Tokens. Notwithstanding any other provision of
   these Terms, the Company reserves the right to treat as void any transfer or
   attempted transfer of a Mainnet Token that the Company reasonably believes to be
   unlawful for any reason. Transferees of Mainnet Tokens in permitted transfers
   shall be deemed to be bound by these Terms and the Manifest Network Terms and
   Policies. The owner of the wallet in which any Token is held will (except as
   otherwise required under applicable law or as ordered by a court of competent
   jurisdiction) be treated as the absolute owner of that Token for all purposes
   (regardless of any notice of any trust or any other interest, or the theft or
   loss of any private key), and neither the Company nor any other person will be
   liable for so treating that person as the absolute owner of such Token. By
   transferring any Token in a permitted transfer, you assign all your rights,
   title and interest under these Terms to the transferee. Transfers of any Mainnet
   Token shall be effective only when the time and date of the relevant transfer
   are included in a block on the Manifest Network. If any rule of law requires
   written notice to effect the transfer of any Mainnet Token, such notice is
   deemed to have been given as an electronic record by inclusion of the relevant
   transaction on a block on the Manifest Network. Protections offered by
   applicable law in relation to the acquisition, storage, sale and/or transfer of
   the instruments and/or investments of the types do not apply to the transfer of
   Mainnet Tokens under these Terms or to your storage, sale and/or transfer of
   Mainnet Tokens.
   
f. Excluded Contributions. The Token Migration involves only the exchange of
   Alpha Tokens for Mainnet Tokens on a 1-for-10 basis. Any other type of
   consideration, including any type of fiat or cryptocurrency will not be
   accepted.
   
g. Delivery. After completion of the Token Migration, the account you used to
   migrate tokens will be credited with the appropriate number of Mainnet Tokens
   from the total amount of Alpha Tokens you exchanged during the Token Migration
   (the “Migration Distribution”). All deliveries from the Migration Distribution
   will be made electronically. Deliveries will be made directly to the account,
   address or wallet associated with your Token Migration. The Company reserves the
   right to prescribe additional conditions relating to specific wallet
   requirements for the Token Migration at any time, acting in its sole discretion.
   
h. Third Party Service Provider or Agent. If you participate in the Token
   Migration through a third party service provider or agent, that service provider
   or agent is your agent, not ours, for the purpose of the Token Migration. You,
   not we, are responsible for ensuring that we actually receive the appropriate
   amount of Alpha Tokens and that you receive the appropriate amount of Mainnet
   Tokens. We are not responsible for any loss or delay of Tokens due to your use
   of a third party service provider or agent.
   
i. Exchange Submission Rejection. Without limiting the grounds upon which the
   Company may refuse to distribute Mainnet Tokens, if distribution of Mainnet
   Tokens to you, or the holding of Mainnet Tokens by you, is or becomes impossible
   or a violation of any applicable legal or regulatory requirements, or the
   Company suspects this may be the case, then: i. the Company need not allow you
   to participate in the Token Migration or other distribute any Mainnet Tokens to
   you nor, in either case, to any other person or entity acting on your behalf; ii
   the Company may request, require or facilitate that steps be taken to ensure the
   full return of any Mainnet Tokens that you hold; iii. the Company reserves the
   right to terminate its relationship with you and take any actions considered
   necessary or desirable for the Company to meet its legal and regulatory
   obligations; and iv. such actions will be irrespective of any original
   contribution that has been made by you to the Company and/or any other third
   party in respect of the Mainnet Token, and the Company may undertake any such
   actions at its sole discretion, with or without disclosing the basis for such
   action.
   
j. Remaining Mainnet Tokens. Any Mainnet Tokens that are not migrated at the end
   of the Migration Period will be retained by the Company and transferred to the
   Company token treasury. Any unclaimed Mainnet Tokens will be used at the sole
   discretion of the Company for staking rewards, ecosystem development, marketing
   uses, and any other purpose that the Company may elect.

#### 7.  Acknowledgement and Assumption of Risks

You acknowledge and agree that there are risks associated with purchasing
Tokens, holding Tokens, migrating Tokens, and using Tokens for providing or
receiving Services in the Manifest Network, including, without limitation, those
disclosed and explained below (the “Risk Disclosures”). BY PARTICIPATING IN THE
TOKEN MIGRATION, YOU EXPRESSLY ACKNOWLEDGE AND ASSUME ALL OF THESE RISKS.

a. Risk of Losing Access to Tokens Due to Wallet Incompatibility: Your
   cryptocurrency wallet must possess technical infrastructure that is compatible
   with the receipt, storage and transfer of the Mainnet Token. Non-compatible
   wallet addresses will not be accepted. In addition, your wallet address must not
   be associated with a third party exchange or service that has custody over the
   private key. You must own the private key if your address is an exchange
   address. The Company reserves the right to prescribe additional conditions
   relating to specific wallet requirements for the Token Migration at any time,
   acting in its sole discretion.
   
b. Risks Associated with the Blockchain Protocols: Mainnet Tokens drive the
   Manifest Network protocol. As such, any malfunction, breakdown, abandonment,
   unintended function, unexpected functioning of or attack on the Manifest Network
   protocol may have an adverse effect on the Tokens, respectively, including
   causing them to malfunction or function in an unexpected or unintended manner.
   
c. Risks Associated with Your Credentials: Any third party that gains access to
   or learns of your wallet login credentials or private keys may be able to
   dispose of your Tokens. To minimize this risk, you should guard against
   unauthorized access to your electronic devices. Best practices dictate that you
   safely store private keys in one or more backup locations geographically
   separated from the working location. In addition, you are responsible for giving
   us the correct wallet address to which to send your Mainnet Tokens. If you give
   us the incorrect address to which to send your Mainnet Tokens, we are not
   responsible for any loss that may occur.
   
d. Risk of Unfavorable Regulatory Action in One or More Jurisdictions: i.
   Blockchain technologies and cryptographic tokens have been the subject of
   scrutiny by various regulatory bodies around the world. Blockchain technology
   allows new forms of interaction and it is possible that certain jurisdictions
   will apply existing regulations on, or introduce new regulations addressing,
   blockchain technology based applications, which regulations may be contrary to
   the current setup of the Manifest Network or its smart contract system and,
   therefore, may result in substantial modifications to the Manifest Network and
   such smart contract systems, including its termination and the loss of Mainnet
   Tokens; ii. The regulatory status of cryptographic tokens and distributed ledger
   technology is unclear or unsettled in many jurisdictions. It is difficult to
   predict how or whether regulatory authorities may apply existing regulation with
   respect to such technology and its applications, including specifically (but
   without limitation to) the Manifest Network and Tokens. It is likewise difficult
   to predict how or whether any legislative or regulatory authorities may
   implement changes to law and regulation affecting distributed ledger technology
   and its applications, including specifically (but without limitation to) the
   Manifest Network and Mainnet Tokens. Regulatory actions could negatively impact
   the Manifest Network and Mainnet Tokens in various ways, including, for purposes
   of illustration only, through a determination that Mainnet Tokens are a
   regulated financial instrument that requires registration, licensing or
   restriction; iii. The Company may cease operations in a jurisdiction if
   regulatory actions, or changes to law or regulation, make it illegal to operate
   in such jurisdiction, or commercially undesirable to obtain the necessary
   regulatory approval(s) to operate in such jurisdiction. The functioning of the
   Manifest Network and the Mainnet Tokens could be impacted by any regulatory
   inquiries or actions, including restrictions on the use, sale or possession of
   digital tokens, which restrictions could impede, limit or end the development of
   the Manifest Network and increase legal costs; iv. The cryptocurrency exchange
   market, the token listing and trading market, initial coin offerings, and by
   extension the Manifest Network, is subject to a variety of federal, state and
   international laws and regulations, including those with respect to “know you
   customer” and “anti-money laundering” and customer due diligence procedures,
   privacy and data protection, consumer protection, data security, and others.
   These laws and regulations, and the interpretation or application of these laws
   and regulations, could change. In addition, new laws or regulations affecting
   the Manifest Network could be enacted, which could impact the utility of Mainnet
   Tokens in the Manifest Network. Additionally, Manifest Network users are subject
   to or may be adversely affected by industry-specific laws and regulations or
   licensing requirements. If any of these parties fail to comply with any of these
   licensing requirements or other applicable laws or regulations, or if such laws
   and regulations or licensing requirements become more stringent or are otherwise
   expanded, it could adversely impact the Manifest Network and the Mainnet Tokens.
   
e. Risk of Alternative, Unofficial Manifest Network: Following the Token
   Migration and the continued development of the initial version of the Manifest
   Network, it is possible that alternative applications could be established,
   which use the same open-source code and protocol underlying the Manifest
   Network. The Mainnet Tokens may lose value or functionality if such alternative
   applications are created.
   
f. Risk of Malfunction: It is possible that the Manifest Network malfunctions in
   an unfavorable way, including one that results in the loss of tokens during or
   after the Token Migration.
   
g. Risk of Taxation: The tax characterization of the Mainnet Tokens is
   uncertain. You must seek your own tax advice in connection with acquiring and
   holding Tokens, which may result in adverse tax consequences to you, including
   withholding taxes, income taxes, and tax reporting requirements.
   
h. Risk of Theft and Hacking: Smart contracts, software applications and the
   Manifest Network may be exposed to attacks by hackers or other individuals,
   groups, organizations or countries that interfere with the Manifest Network or
   the availability of the Tokens in any number of ways, including denial of
   service attacks, Sybil attacks, spoofing, smurfing, malware attacks, or
   consensus-based attacks, or phishing, or other novel methods that may or may not
   be known. Any such successful attacks could result in theft or loss of Tokens,
   adversely impacting the ability to further develop the Manifest Network and/or
   related projects and derive any usage or functionality from tokens. You must
   take appropriate steps to satisfy yourself of the integrity and veracity of
   relevant websites, systems and communications. Furthermore, because the Manifest
   Network is based on open-source software, there is a risk that a third party or
   a member of the Company’s team may intentionally or unintentionally introduce
   weaknesses or defects into the core infrastructure of the Manifest Network,
   which could negatively affect the Manifest Network and Mainnet Tokens.
   
i. Risks Associated with Incomplete Information Regarding the Token Migration:
   You will not have full access to all the information relevant to the Company,
   the Mainnet Tokens and/or the Manifest Network. You are responsible for making
   your own decision in respect of the Token Migration. The Company does not
   provide you with any recommendation or advice in respect of the Token Migration.
   You may not rely on the Company to provide you with complete or up to date
   information.
   
j. Unanticipated Risks: Cryptographic tokens, including Mainnet Tokens and Alpha
   Tokens, are a new and untested technology. In addition to the risks discussed in
   these Terms, there are risks that the Company cannot anticipate. Further risks
   may materialize as unanticipated combinations or variations of the discussed
   risks or the emergence of new risks.
   
#### 8.  Representation and Warranties

By participating in the Token Migration, you represent, warrant, and covenant that:

a. You are entering into this agreement and exchanging the Alpha Tokens for
   Mainnet Tokens for the sole purpose of using the Mainnet Tokens on the Manifest
   Network on your own account, not as a nominee or agent, and not with a view to
   resale, and you have no present intention of selling, granting any participation
   in, or otherwise distributing the same. You are an existing holder of Alpha
   Tokens, and you are paying no additional consideration for participating in the
   Token Migration.
   
b. You are not a citizen or resident of a country whose legislation conflicts
   with the Token Migration.
   
c. You have sufficient understanding of cryptographic tokens, token storage
   mechanisms (such as token wallets), and blockchain technology to understand
   these Terms and to appreciate the risks and implications of the Token Migration.
   
d. You have read and understand these Terms, and are entering into these Terms
   with us voluntarily and based on your own independent judgment and on advice
   from independent advisors as you have considered to be necessary or appropriate,
   after due inquiry.
   
e. You have obtained sufficient information about the Mainnet Tokens to make an
   informed decision to exchange your Alpha Tokens for Mainnet Tokens.
   
f. The Mainnet Tokens confer only the right to provide and receive services in
   the Manifest Network and confer no other rights of any form or nature with
   respect to the Manifest Network or the Company, including, but not limited to,
   any voting, distribution, redemption, liquidation, proprietary (including all
   forms of intellectual property), or other financial or legal rights. You
   acknowledge and accept that Mainnet Tokens do not represent or constitute: i.
   any ownership right or stake, share, equity, security, collective investment
   scheme, managed fund, financial derivative, futures contract, deposit,
   commercial paper, negotiable instrument, investment contract, note, commodity,
   bond, warrant, certificate debt or hybrid instrument or any other financial
   instrument or investment entitling the holder to interest, dividends or any kind
   or return or carrying equivalent rights (including in respect of the Company or
   the Manifest Network); ii. any right to receive future revenues, shares or any
   other form of participation or governance right from, in or relating to the
   Company and/or the Manifest Network; iii. any form of currency, money, deposit
   or legal tender, whether fiat or otherwise, in any jurisdiction, nor do they
   constitute any substitute or representation of currency, money, deposit or legal
   tender (including electronic money); or iv. any right, title, interest or
   benefit whatsoever in whole or in part, in the Manifest Network, the Company or
   any assets related to either of them.
   
g. You are not exchanging your Alpha Tokens for Mainnet Tokens for any use or
   purpose other than to provide or receive services in the Manifest Network,
   including, but not limited to, for any investment, speculative or other
   financial purposes.
   
h. Your exchange of your Alpha Tokens for Mainnet Tokens complies with
   applicable law and regulation in your jurisdiction, including, but not limited
   to, (i) legal capacity and any other threshold requirements in your jurisdiction
   for the Token Migration and entering into contracts with us, (ii) any foreign
   exchange or regulatory restrictions applicable to the Token Migration, and (iii)
   any governmental or other consents that may need to be obtained.
   
i. You shall promptly provide to the Company, upon request, proof of identity
   and/or source of funds and/or other documentation or other information that the
   Company may request from time to time in connection with the Company's
   obligations under, and compliance with, applicable laws and regulations,
   including but not limited to anti money laundering legislation, regulations or
   guidance and/or tax information reporting or withholding legislation,
   regulations or guidance, or any “Know Your Customer” requirements and policies.
   
j. You are legally permitted to receive the Mainnet Tokens.

k. You will comply with any applicable tax obligations, if any, in your
   jurisdiction arising from the Token Migration.
   
l. If you are exchanging Alpha Tokens for Mainnet Tokens on behalf of any
   entity, (i) you are authorized to accept these Terms on such entity's behalf and
   such entity will be responsible for breach of these Terms by you or any other
   employee or agent of such entity (references to “you” in these Terms refer to
   you and such entity, jointly); (ii) the acceptance of these Terms and the entry
   into a binding agreement with the Company will not result in any breach of, be
   in conflict with, or constitute a material default under: (A) any provision of
   such entity’s constitutional or organizational documents (in the case of a
   corporate entity including, without limitation, any company or partnership); (B)
   any provision of any judgment, decree or order imposed on such entity by any
   court or governmental or regulatory authority; and/or (C) any material
   agreement, obligation, duty or commitment to which such entity is a party or by
   which such entity is bound; and (iii) such entity is duly incorporated,
   registered and validly existing under the applicable laws of the jurisdiction in
   which the entity is established.
   
m. If you are a corporation, company, partnership or other “non-natural person”
   entity, (i) the acceptance of these Terms and the entry into a binding agreement
   with the Company will not result in any breach of, be in conflict with, or
   constitute a material default under: (A) any provision of your constitutional or
   organizational documents (in the case of a corporate entity including, without
   limitation, any company or partnership); (B) any provision of any judgment,
   decree or order imposed on you by any court or governmental or regulatory
   authority; and/or (C) any material agreement, obligation, duty or commitment to
   which you are a party or by which you are bound; and (ii) you are duly
   incorporated or organized, registered and validly existing under the applicable
   laws of the jurisdiction in which you are established.
   
n. You are not a governmental or semi-governmental authority.

o. You are not exchanging your Alpha Tokens for Mainnet Tokens from countries or
   regions comprehensively sanctioned by the U.S. Office of Foreign Assets Control
   (“OFAC”) (including countries such as Ukraine, Cuba, Iran, North Korea, Sudan
   and Syria), or on behalf of governments of these countries or regions, nor will
   you use the Tokens to conduct or facilitate any transactions with persons or
   entities located in these countries or regions.
   
p. You are not (i) a citizen or resident of a geographic area in which access to
   or use of the Services is prohibited by applicable law, decree, regulation,
   treaty, or administrative act, (ii) a citizen or resident of, or located in, a
   geographic area that is subject to U.S. or other applicable comprehensive
   country sanctions or embargoes, or (iii) an individual, or an individual
   employed by or associated with an entity, identified on the U.S. Department of
   Commerce's Denied Persons, Unverified, or Entity List, the U.S. Department of
   Treasury's Specially Designated Nationals or Blocked Persons or Foreign
   Sanctions Evaders Lists, or the U.S. Department of State's Debarred Parties
   List. You will not use the Mainnet Tokens to conduct or facilitate any
   transactions with such persons described above. You agree that if your country
   of residence or other circumstances change such that the above representations
   are no longer accurate, that you will immediately cease engaging with the Token
   Migration, Mainnet Tokens, and Manifest Network. If you are registering to
   engage with the Token Migration, Mainnet Tokens, and Manifest Network on behalf
   of a legal entity, you further represent and warrant that (i) such legal entity
   is duly organized and validly existing under the applicable laws of the
   jurisdiction of its organization, and (ii) you are duly authorized by such legal
   entity to act on its behalf and bind it to these Terms.
   
q. Mainnet Tokens are not intended to be a digital currency, security, commodity
   or any other kind of financial instrument.
   
r. These Terms shall not be construed as an invitation to subscribe for any
   securities, and you understand and acknowledge that no actions of, or
   documentation issued by the Company, shall be construed as such.
   
t. You are of a sufficient age to legally obtain and use Mainnet Tokens.

u. With regard to the Mainnet Tokens, we make no guarantees that you will be
   able to resell the Mainnet Tokens, or as to their future value, and that no
   market liquidity may be guaranteed and that the value of the Mainnet Tokens over
   time may experience extreme volatility or depreciate in full.
   
v. You must maintain accurate records as to your ownership amounts of Mainnet
   Tokens, correct address and physical location, location of wallets,
   participation efforts, and provide all requested information necessary for the
   Company to maintain accurate records as to the ecosystem created for the
   Company.
   
w. You bear the sole responsibility to determine whether the creation, ownership
   or use of the Mainnet Tokens, the potential appreciation or depreciation in the
   value of the Mainnet Tokens over time, the exchange of Alpha Tokens for Mainnet
   Tokens and/or any other action or transaction related to the Manifest Network
   may have tax implications. By obtaining, holding or using the Tokens, and to the
   extent permitted by law, you agree not to hold any third party (including
   developers, auditors (e.g. contractors or founders)) liable for any tax
   liability associated with or arising from the creation, ownership or use of the
   Tokens or any other action or transaction related to the Manifest Network. You
   are urged to consult with your own tax advisors to discuss any potential tax
   implications from the Token Migration.
   
x. You have no right against any other party to request any refund of Alpha
   Tokens exchanged for Mainnet Tokens, under any circumstances.
   
y. You will not use the Tokens to finance, engage in or otherwise support any
   unlawful activities.

#### 9.  Limitation of Liability

To the fullest extent allowed by applicable law, in no event shall the owners
of, or contributors to, the Website be liable for any damages of any kind,
including, but not limited to, indirect, special, incidental, punitive, or
consequential damages of any kind, including damages for loss of use, loss of
profits, business interruption, loss of goodwill, or loss of data arising out of
or in any way connected with the use of the Website. You further assume and
agree that we will have no responsibility or liability for, the risks set forth
in this Terms. You hereby irrevocably waive, release and discharge all claims,
whether known or unknown to you, against us, and our respective shareholders,
members, directors, officers, employees, agents, and representatives, suppliers,
and contractors related to any of the risks set forth in this Terms.

#### 10. Indemnification

You do hereby to the fullest extent permitted by applicable law, agree to
defend, indemnify, and hold harmless the Company, The Lifted Initiative, Inc.
(issuer of the Alpha Tokens), and each of their affiliates, and parent and
subsidiary entities, and all of the foregoing’s respective stockholders,
members, directors, officers, managers, employees, attorneys, agents,
representatives, suppliers, and contractors (collectively, “Indemnified
Parties”), from and against any and all actual and threatened claims, lawsuits,
demands, actions, investigations (whether formal or informal), liabilities,
obligations, judgments, damages, penalties, interests, fees, losses, expenses
(including reasonable attorneys' fees and expenses), and costs (including,
without limitation, court costs, costs of settlement, and costs of pursuing
indemnification and insurance), of every kind and nature whatsoever, whether
claimed by governmental authorities, known or unknown, foreseen or unforeseen,
matured or unmatured, or suspected or unsuspected, in law or equity, whether in
tort, contract, or otherwise (collectively “Claims”) arising from or relating
to:

a. your purchase, acquisition, holding, migrating or use of the Mainnet Tokens
   and Alpha Tokens;

b. the performance or non-performance of your responsibilities or obligations
   under these Terms;
   
c. any inaccurate representation or warranty made by you, or breach or failure
   by you to comply with any covenant or agreement made by you in these Terms or in
   any other document furnished by you to any of the foregoing in connection with
   this Token Migration;
  
d. your violation of any rights (including, but not limited to, intellectual
   property rights) of any other person or entity;
   
e. any act or omission of yours that is negligent, unlawful, or constitutes
   wilful misconduct;
   
f. any action instituted by or on behalf of you against us that is finally
   resolved by judgment against you or in favour of us; or
  
g. your breach or violation of these Terms.

If you are obligated to indemnify any Indemnified Party (or, at its discretion,
the applicable Indemnified Party). We will have the right, in our sole
discretion, to control any action or proceeding and to determine whether we wish
to settle, and if so, on what terms, and you agree to cooperate with us in the
defense.

To the fullest extent permitted by applicable law, you release the Indemnified
Parties from responsibility, liability, claims, losses, demands and/or damages
(actual and consequential) of every kind and nature, known and unknown
(including, but not limited to, claims of negligence), arising out of or related
to disputes between you and the acts or omissions of third parties. This
indemnification shall survive any disposition of your Tokens.

#### 11. Arbitration

PLEASE READ THIS CLAUSE CAREFULLY BECAUSE IT LIMITS THE MANNER IN WHICH YOU CAN
SEEK RELIEF.

Except for disputes related to copyrights, logos, trademarks, trade names, trade
secrets or patents, any dispute, controversy or claim arising out of, relating
to, or in connection with your use of the Website, or in connection with these
Terms, including disputes arising from or concerning their interpretation,
violation, invalidity, non-performance, or termination, shall be finally
resolved by binding arbitration by the Judicial Arbitration and Mediation
Services (JAMS) pursuant to its Comprehensive Arbitration Rules and Procedures.

As limited by applicable law, this Terms and the applicable JAMS rules, the
arbitrator will have (i) the exclusive authority and jurisdiction to make all
procedural and substantive decisions regarding a dispute, including the
determination of whether a dispute is arbitrable, and (ii) the authority to
grant any remedy that would otherwise be available in court; provided, however,
that the arbitrator does not have the authority to conduct a class arbitration
or a representative action, which is prohibited by this Terms. The arbitrator
may only conduct an individual arbitration and may not consolidate more than one
individual’s claims, preside over any type of class or representative proceeding
or preside over any proceeding involving more than one individual.

You will notify the us in writing of any dispute within 30 days of the date it
arises, so that the we can attempt in good faith to resolve the dispute
informally. Your notice must include (i) your name, postal address, email
address, and telephone number, (ii) a description in reasonable detail of the
nature or basis of the dispute, and (iii) the specific relief that you are
seeking. If you and the Company cannot agree how to resolve the dispute within
30 days after the date notice is received by the applicable party, then either
you or the Company may, as appropriate and in accordance with this Section 9,
commence an arbitration proceeding.

You agree that the laws of the State of Michigan, without regard to principles
of conflict of laws, govern this Terms and any dispute between you and us. You
further agree that the Token Migration shall be deemed to be based solely in the
State of Michigan, and that although the migration may be available in other
jurisdictions, its availability does not give rise to general or specific
personal jurisdiction in any forum outside the State of Michigan.

You agree that the federal and state courts of Michigan are the proper forum for
any appeals of an arbitration award or for court proceedings in the event that
this Terms binding arbitration clause is found to be unenforceable.

The rules of JAMS and additional information about JAMS are available on the
JAMS website (https://www.jamsadr.com/).  By agreeing to be bound by this Terms
of Use, You either (i) acknowledges and agrees that you have read and
understands the rules of JAMS, or (ii) waives your opportunity to read the rules
of JAMS and any claim that the rules of JAMS are unfair or should not apply for
any reason.

12. Waiver of Jury Trial and Class Action

With respect to all persons and entities, regardless of whether they have
obtained or used the site for personal, commercial, or other purposes, all
disputes, controversies, or claims must be brought in the parties' individual
capacity, and not as a plaintiff or class member in any class action, collective
action, or other representative proceeding. This waiver applies to class
arbitration, and unless we agree otherwise, the arbitrator may not consolidate
more than one person's claims.

The parties agree to arbitrate solely on an individual basis, and these Terms do
not permit class arbitration, or any claims brought as a plaintiff or class
member in any representative arbitration proceeding. The arbitral tribunal may
not consolidate more than one person's claims and may not preside over any form
of a representative or class proceeding. In the event the prohibition on class
arbitration is deemed invalid or unenforceable, the remaining portions of this
agreement to arbitrate will remain in force.

#### 13. Changes

We may revise and update the Terms from time to time on our sole discretion and
without notice. All changes are effective immediately when we post them and
apply to all access to and use of the Website thereafter. Your continued use of
the Website following the posting of revised Terms means that you accept and
agree to the changes. You are expected to check this page from time to time so
you are aware of any changes, as they are binding on you.

#### 14. No Waivers

The failure by us to enforce any provision of these Terms will not constitute a
present or future waiver of such provision nor limit our right to enforce such
provision at a later time. All waivers by us must be in writing to be effective.
`
